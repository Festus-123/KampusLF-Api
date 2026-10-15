import { Router } from "express";
import { ItemController } from "../../controllers/items/itemsController.js";
import { authMiddleware } from '../../middlewares/auth/authMiddleware.js'

const router = Router();

router.get("/", ItemController.getAllLostItems);
router.get("/page", ItemController.getLostItemsPage);
router.get("/mine", authMiddleware, ItemController.getMyLostItems);
router.get("/:id", ItemController.getLostItemById);

router.use(authMiddleware);
router.post("/", ItemController.createLostItem);
router.patch("/:id", ItemController.updateLostItem)
router.delete("/:id", ItemController.deleteLostItem)

export default router;