import { requestModel } from "../../models/request/requestModel.js";
import { requireId, requireItem } from "../../utils/validators/validators.js";

export const RequestService = {
  async getAllRequests() {
    return await requestModel.getAll();
  },

  async getAllRequestsByUser(userId) {
    return await requestModel.getByUser(userId);
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

  async deleteRequest(id) {
    const itemId = requireId(id);
    return requestModel.delete(itemId);
  },
};
