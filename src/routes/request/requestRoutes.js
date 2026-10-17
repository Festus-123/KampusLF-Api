import { Router } from "express";
import { RequestController } from "../../controllers/request/requestController.js";
import { authMiddleware } from "../../middlewares/auth/authMiddleware.js";

const router = Router();

router.get("/", RequestController.getAllRequests);
router.get("/byUser", RequestController.getUserRequests);
router.get("/:id", RequestController.getRequestsById)

router.use(authMiddleware);
router.post("/", RequestController.creatRequest);
router.delete("/:id", RequestController.deleteRequest)

export default router;