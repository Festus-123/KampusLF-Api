import { Router } from "express";
import { RequestController } from "../../controllers/request/requestController.js";
import { authMiddleware } from "../../middlewares/auth/authMiddleware.js";
import { ValidateDataMiddleware } from "../../middlewares/validator/validateDataMiddleware.js";
import { createRequestSchema } from "../../schema/requests/requestsSchema.js";

const router = Router();

router.get("/", RequestController.getAllRequests);
router.get("/byUser", authMiddleware, RequestController.getUserRequests);
router.get("/byOwner", authMiddleware, RequestController.getItemOwnerRequests);
router.get("/:id", RequestController.getRequestsById);

router.use(authMiddleware);
router.post("/", ValidateDataMiddleware(createRequestSchema), RequestController.creatRequest);
router.patch("/:id/status", RequestController.markRequestReclaimed);
router.patch("/:id/owner-status", RequestController.updateOwnerRequestStatus);
router.delete("/:id/owner", RequestController.denyRequest);
router.delete("/:id", RequestController.deleteRequest);

export default router;
