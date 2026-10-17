import { RequestService } from "../../services/request/requestService.js";
import { getUserId, requireId } from "../../utils/validators/validators.js";

export const RequestController  = {

    async getAllRequests (req, res, next) {
        try {
            const result = await RequestService.getAllRequests();
            res.status(200).json(result)
        } catch (error) {
            next(error)
        }
    },

    async getUserRequests (req, res, next)  {
        try {
            const userId = getUserId(req)
            const result = await RequestService.getAllRequestsByUser(userId);
            res.status(200).json(result);
        } catch (error) {
            next(error)
        }
    },

    async getRequestsById (req, res, next) {
        try {
            const result = await RequestService.getRequestsById(req.params.id)
            res.status(200).json(result);
        } catch (error) {
            next(error)
        }
    },

    async creatRequest (req, res, next) {
        try {
            const result = await RequestService.createRequest({
                ...req.body,
                userId: getUserId(req),
                itemId: requireId(req.body.itemId)
            })
            res.status(200).json(result)
        } catch (error) {
            next(error)
        }
    },

    async deleteRequest (req, res, next){
        try {
            const result = await RequestService.deleteRequest(req.params.id)
            res.status(200).json(result)
        } catch (error) {
            next(error);
        }
    }
}