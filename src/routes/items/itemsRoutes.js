import { Router } from "express";
import { ItemController } from "../../controllers/items/itemsController.js";
import { authMiddleware } from '../../middlewares/auth/authMiddleware.js'
import { ValidateDataMiddleware } from "../../middlewares/validator/validateDataMiddleware.js";
import { createItemsSchema, updateItemsSchema } from "../../schema/items/itemsSchema.js";

const router = Router();

router.get("/", ItemController.getAllLostItems);
router.get("/page", ItemController.getLostItemsPage);
router.get("/mine", authMiddleware, ItemController.getMyLostItems);
router.get("/:id", ItemController.getLostItemById);

router.use(authMiddleware);
router.post("/", ValidateDataMiddleware(createItemsSchema), ItemController.createLostItem);
router.patch("/:id", ValidateDataMiddleware(updateItemsSchema), ItemController.updateLostItem)
router.delete("/:id", ItemController.deleteLostItem)

export default router;