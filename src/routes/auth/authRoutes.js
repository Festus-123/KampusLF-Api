import { Router } from 'express';
import { AuthController } from '../../controllers/auth/authController.js';
import rateLimit from 'express-rate-limit';

const router = Router();

const logInLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 4,
    message: "Too Many log in attempts, try again later"
})

router.post("/signup", AuthController.signup)
router.post("/signin",logInLimiter, AuthController.signin)
router.post('/refresh', AuthController.refresh)

export default router;