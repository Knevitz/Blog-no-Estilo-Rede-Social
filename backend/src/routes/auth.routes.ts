// src/routes/auth.routes.ts
import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
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

router.post("/check-email", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "E-mail não fornecido." });
  }

  try {
    const userRepo = AppDataSource.getRepository(User);
    const existing = await userRepo.findOne({ where: { email } });

    return res.json({ exists: !!existing });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Erro interno ao verificar e-mail." });
  }
});

router.post("/check-username", async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Usuário não fornecido." });
  }

  try {
    const userRepo = AppDataSource.getRepository(User);
    const existing = await userRepo.findOne({ where: { username } });

    return res.json({ exists: !!existing });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Erro interno ao verificar usuário." });
  }
});

export default router;
