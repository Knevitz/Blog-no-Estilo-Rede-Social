import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();
const authController = new AuthController();

router.post("/register", authController.register.bind(authController));
router.post("/login", authController.login.bind(authController));
router.post("/refresh-token", authController.refreshToken.bind(authController));
router.post(
  "/forgot-password",
  authController.forgotPassword.bind(authController)
);
router.get(
  "/validate-reset-token",
  authController.validateResetToken.bind(authController)
);
router.post(
  "/reset-password",
  authController.resetPassword.bind(authController)
);
router.get(
  "/profile",
  authenticate,
  authController.profile.bind(authController)
);

export default router;
