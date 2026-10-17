import { ItemService } from "../../services/items/itemsService.js";
import CustomError from "../../utils/custom-error/customError.js";
import ERROR_MESSAGES from "../../utils/error-messages/errorMessages.js";
import { getUserId } from "../../utils/validators/validators.js";

export const ItemController = {
  async getAllLostItems(req, res, next) {
    try {
      const items = await ItemService.getAllLostItems();
      res.status(200).json(items);
    } catch (error) {
      next(error);
    }
  },

  async getMyLostItems(req, res, next) {
    try {
      const items = await ItemService.getMyLostItems(getUserId(req));
      res.status(200).json(items);
    } catch (error) {
      next(error);
    }
  },

  async getLostItemsPage(req, res, next) {
    try {
      const page = await ItemService.getLostItemsPage(
        req.query.offset ?? 0,
        req.query.limit ?? 12,
      );
      res.status(200).json(page);
    } catch (error) {
      next(error);
    }
  },

  async getLostItemById(req, res, next) {
    try {
      const item = await ItemService.getLostItemById(req.params.id);
      res.status(200).json(item);
    } catch (error) {
      next(error);
    }
  },

  async createLostItem(req, res, next) {
    try {
      const item = await ItemService.createLostItem({
        ...req.body,
        userId: getUserId(req),
      });
      res.status(201).json(item);
    } catch (error) {
      next(error);
    }
  },

  async updateLostItem(req, res, next) {
    try {
      const item = await ItemService.updateLostItem(
        req.params.id,
        getUserId(req),
        req.body,
      );
      res.status(200).json(item);
    } catch (error) {
      next(error);
    }
  },

  async deleteLostItem(req, res, next) {
    try {
      const item = await ItemService.deleteLostItem(
        req.params.id,
        getUserId(req),
      );
      res.status(200).json(item);
    } catch (error) {
      next(error);
    }
  },
};
