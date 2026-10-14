import { AuthServices } from "../../services/auth/authService.js";


export const AuthController = {
    async signup (req, res, next) {
        try {
            const {name, email, password} = req.body;
            const result = await AuthServices.signup(name, email, password);
            res.status(200).json(result);
        } catch (error) {
            next(error)
        }
    },

    async signin (req, res, next) {
        try {
            const {email, password} = req.body;
            const result = await AuthServices.signin(email, password)
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },

    async refresh (req, res, next) {

    },
}