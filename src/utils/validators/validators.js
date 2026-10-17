import CustomError from "../custom-error/customError.js";
import ERROR_MESSAGES from "../error-messages/errorMessages.js";

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

const getUserId = (req) => {
  const userId = req.user?.id ?? req.user?.sub;
  if (!userId) {
    throw new CustomError(ERROR_MESSAGES.AUTHENTICATION_REQUIRED, 401);
  }
  return userId;
};

const getItemId = (req) => {
    const itemId = req.item?.id ?? req.item?.sub;
    if(!itemId) {
        throw new CustomError(ERROR_MESSAGES.RESOURCE_NOT_FOUND, 404);
    }
    return itemId;
}
export {requireId, requireItem, getUserId, getItemId}