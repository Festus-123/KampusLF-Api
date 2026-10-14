import { Router } from "express";
import { ItemController } from "../../controllers/items/itemsController.js";

const router = Router();

router.get("/", ItemController.getAllLostItems);
router.get("/:id", ItemController.getLostItemById);

router.post("/", ItemController.createLostItem);
router.patch("/:id", ItemController.updateLostItem)
router.delete("/:id", ItemController.deleteLostItem)

export default router;