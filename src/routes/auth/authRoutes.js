import { Router } from 'express';
import { AuthController } from '../../controllers/auth/authController.js';

const router = Router();

router.post("/signup", AuthController.signup)
router.post("/signin", AuthController.signin)
// router.post("/refresh", )

export default router;