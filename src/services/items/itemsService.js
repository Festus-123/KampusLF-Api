import { itemModel } from "../../models/items/itemsModel.js";
import CustomError from "../../utils/custom-error/customError.js";
import ERROR_MESSAGES from "../../utils/error-messages/errorMessages.js";

const requireId = (value) => {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) {
    throw new CustomError(ERROR_MESSAGES.VALIDATION_FAILED, 400);
  }
  return id;
};

const requireItem = (item) => {
  if (!item) {
    throw new CustomError(ERROR_MESSAGES.RESOURCE_NOT_FOUND, 404);
  }
  return item;
};

export const ItemService = {
  async getAllLostItems() {
    return itemModel.getAllLostItems();
  },

  async getLostItemById(itemId) {
    const id = requireId(itemId);
    return requireItem(await itemModel.getLostItemById(id));
  },

  async createLostItem({ name, tag, properties = [], userId, image = null }) {
    const ownerId = requireId(userId);

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof tag !== "string" ||
      !tag.trim() ||
      !Array.isArray(properties) ||
      !properties.every((property) => typeof property === "string") ||
      (image !== null && typeof image !== "string")
    ) {
      throw new CustomError(ERROR_MESSAGES.VALIDATION_FAILED, 400);
    }

    return itemModel.createLostItem({
      name: name.trim(),
      tag: tag.trim(),
      properties,
      userId: ownerId,
      image,
    });
  },

  async updateLostItem(itemId, userId, updates) {
    const id = requireId(itemId);
    const ownerId = requireId(userId);
    const allowedFields = ["name", "tag", "properties", "image", "status"];
    const fields = Object.keys(updates ?? {});

    if (
      fields.length === 0 ||
      fields.some((field) => !allowedFields.includes(field))
    ) {
      throw new CustomError(ERROR_MESSAGES.VALIDATION_FAILED, 400);
    }

    if (
      ("name" in updates &&
        (typeof updates.name !== "string" || !updates.name.trim())) ||
      ("tag" in updates &&
        (typeof updates.tag !== "string" || !updates.tag.trim())) ||
      ("properties" in updates &&
        (!Array.isArray(updates.properties) ||
          !updates.properties.every(
            (property) => typeof property === "string",
          ))) ||
      ("image" in updates &&
        updates.image !== null &&
        typeof updates.image !== "string") ||
      ("status" in updates &&
        (typeof updates.status !== "string" || !updates.status.trim()))
    ) {
      throw new CustomError(ERROR_MESSAGES.VALIDATION_FAILED, 400);
    }

    const normalizedUpdates = { ...updates };
    if (typeof normalizedUpdates.name === "string") {
      normalizedUpdates.name = normalizedUpdates.name.trim();
    }
    if (typeof normalizedUpdates.tag === "string") {
      normalizedUpdates.tag = normalizedUpdates.tag.trim();
    }
    if (typeof normalizedUpdates.status === "string") {
      normalizedUpdates.status = normalizedUpdates.status.trim();
    }

    return requireItem(
      await itemModel.updateLostItem(id, ownerId, normalizedUpdates),
    );
  },

  async deleteLostItem(itemId, userId) {
    const id = requireId(itemId);
    const ownerId = requireId(userId);
    return requireItem(await itemModel.deleteLostItem(id, ownerId));
  },
};
