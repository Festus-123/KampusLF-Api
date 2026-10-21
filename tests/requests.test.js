import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../src/app/app.js";
import { RequestService } from "../src/services/request/requestService.js";

vi.mock("../src/services/request/requestService.js", () => ({
  RequestService: {
    getAllRequests: vi.fn(),
    getAllRequestsByUser: vi.fn(),
    getAllRequestsForItemOwner: vi.fn(),
    getRequestsById: vi.fn(),
    createRequest: vi.fn(),
    updateRequestStatus: vi.fn(),
    updateOwnerRequestStatus: vi.fn(),
    deleteRequest: vi.fn(),
    denyRequest: vi.fn(),
  },
}));

const jwtSecret = "requests-test-secret";
process.env.JWT_SECRET = jwtSecret;

const authHeader = () => ({
  Authorization: `Bearer ${jwt.sign({ sub: "42", email: "user@example.com" }, jwtSecret)}`,
});

describe("Requests endpoints", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns all requests with a 200 response", async () => {
    const requests = [{ id: 1, item_id: 5 }];
    RequestService.getAllRequests.mockResolvedValue(requests);

    const response = await request(app).get("/api/v1/requests");

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(requests);
  });

  it("returns a request by id", async () => {
    const itemRequest = { id: 8, item_id: 5 };
    RequestService.getRequestsById.mockResolvedValue(itemRequest);

    const response = await request(app).get("/api/v1/requests/8");

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(itemRequest);
    expect(RequestService.getRequestsById).toHaveBeenCalledWith("8");
  });

  it("requires authentication for user-specific requests", async () => {
    const response = await request(app).get("/api/v1/requests/byUser");

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      error: "Missing or malformed Authorization header",
    });
    expect(RequestService.getAllRequestsByUser).not.toHaveBeenCalled();
  });

  it("returns requests for the authenticated user and item owner", async () => {
    const userRequests = [{ id: 2, item_id: 7 }];
    const ownerRequests = [{ id: 3, item_id: 9 }];
    RequestService.getAllRequestsByUser.mockResolvedValue(userRequests);
    RequestService.getAllRequestsForItemOwner.mockResolvedValue(ownerRequests);

    const userResponse = await request(app)
      .get("/api/v1/requests/byUser")
      .set(authHeader());
    const ownerResponse = await request(app)
      .get("/api/v1/requests/byOwner")
      .set(authHeader());

    expect(userResponse.status).toBe(200);
    expect(userResponse.body).toStrictEqual(userRequests);
    expect(RequestService.getAllRequestsByUser).toHaveBeenCalledWith("42");
    expect(ownerResponse.status).toBe(200);
    expect(ownerResponse.body).toStrictEqual(ownerRequests);
    expect(RequestService.getAllRequestsForItemOwner).toHaveBeenCalledWith(
      "42",
    );
  });

  it("creates a request for the authenticated user", async () => {
    const requestInput = {
      itemId: 5,
      name: "Alex Student",
      email: "alex@example.com",
      phone: "12345678901",
      message: "I can identify the item.",
      descripts: ["A small blue notebook."],
    };
    const createdRequest = { id: 12, item_id: 5, user_id: 42 };
    RequestService.createRequest.mockResolvedValue(createdRequest);

    const response = await request(app)
      .post("/api/v1/requests")
      .set(authHeader())
      .send(requestInput);

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(createdRequest);
    expect(RequestService.createRequest).toHaveBeenCalledWith({
      ...requestInput,
      userId: "42",
      itemId: 5,
    });
  });

  it("rejects invalid request data before calling the service", async () => {
    const response = await request(app)
      .post("/api/v1/requests")
      .set(authHeader())
      .send({
        name: "",
        email: "bad",
        phone: "123",
        message: "",
        descripts: [],
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid data");
    expect(RequestService.createRequest).not.toHaveBeenCalled();
  });

  it("updates request statuses and supports requester and owner deletion", async () => {
    const changedRequest = { id: 12, status: "reclaimed" };
    const deletedRequest = { id: 12 };
    RequestService.updateRequestStatus.mockResolvedValue(changedRequest);
    RequestService.updateOwnerRequestStatus.mockResolvedValue(changedRequest);
    RequestService.deleteRequest.mockResolvedValue(deletedRequest);
    RequestService.denyRequest.mockResolvedValue(deletedRequest);

    const reclaimedResponse = await request(app)
      .patch("/api/v1/requests/12/status")
      .set(authHeader());
    const ownerStatusResponse = await request(app)
      .patch("/api/v1/requests/12/owner-status")
      .set(authHeader())
      .send({ status: "returning" });
    const deleteResponse = await request(app)
      .delete("/api/v1/requests/12")
      .set(authHeader());
    const denyResponse = await request(app)
      .delete("/api/v1/requests/12/owner")
      .set(authHeader());

    expect(reclaimedResponse.status).toBe(200);
    expect(reclaimedResponse.body).toStrictEqual(changedRequest);
    expect(RequestService.updateRequestStatus).toHaveBeenCalledWith(
      "12",
      "42",
      "reclaimed",
    );
    expect(ownerStatusResponse.status).toBe(200);
    expect(ownerStatusResponse.body).toStrictEqual(changedRequest);
    expect(RequestService.updateOwnerRequestStatus).toHaveBeenCalledWith(
      "12",
      "42",
      "returning",
    );
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toStrictEqual(deletedRequest);
    expect(RequestService.deleteRequest).toHaveBeenCalledWith("12", "42");
    expect(denyResponse.status).toBe(200);
    expect(denyResponse.body).toStrictEqual(deletedRequest);
    expect(RequestService.denyRequest).toHaveBeenCalledWith("12", "42");
  });
});
