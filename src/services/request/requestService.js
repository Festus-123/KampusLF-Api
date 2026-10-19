import { requestModel } from "../../models/request/requestModel.js";
import CustomError from "../../utils/custom-error/customError.js";
import { requireId, requireItem } from "../../utils/validators/validators.js";

export const RequestService = {
  async getAllRequests() {
    return await requestModel.getAll();
  },

  async getAllRequestsByUser(userId) {
    return await requestModel.getByUser(userId);
  },

  async getAllRequestsForItemOwner(userId) {
    const ownerId = requireId(userId);
    return await requestModel.getByItemOwner(ownerId);
  },

  async getRequestsById(id) {
    const requestId = requireId(id);
    return await requestModel.getById(requestId);
  },

  async createRequest({
    name,
    email,
    phone,
    message,
    descripts = [],
    userId,
    itemId,
  }) {
    const creatorId = requireId(userId);
    const item = requireId(itemId);
    return requestModel.create({
      itemId: item,
      userId: creatorId,
      name,
      email,
      phone,
      message,
      descripts,
    });
  },

  async updateRequestStatus(id, userId, status) {
    const requestId = requireId(id);
    const requesterId = requireId(userId);
    if (status !== "reclaimed") {
      throw new CustomError("Invalid request status.", 400);
    }
    return requireItem(
      await requestModel.updateStatus(requestId, requesterId, status),
    );
  },

  async updateOwnerRequestStatus(id, userId, status) {
    const requestId = requireId(id);
    const ownerId = requireId(userId);
    if (status !== "returning" && status !== "pending") {
      throw new CustomError("Invalid request status.", 400);
    }
    return requireItem(
      await requestModel.updateStatusByItemOwner(requestId, ownerId, status),
    );
  },

  async deleteRequest(id, userId) {
    const requestId = requireId(id);
    const requesterId = requireId(userId);
    return requireItem(await requestModel.delete(requestId, requesterId));
  },

  async denyRequest(id, userId) {
    const requestId = requireId(id);
    const ownerId = requireId(userId);
    return requireItem(
      await requestModel.deleteByItemOwner(requestId, ownerId),
    );
  },
};
