import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json";
import { AuthController } from "./controllers/auth.controller";
import { authenticate } from "./middlewares/auth.middleware";

export function createApp() {
  const app = express();
  const authController = new AuthController();

  // Middlewares
  app.use(cors());
  app.use(express.json());

  // Public routes
  app.post("/auth/register", authController.register.bind(authController));
  app.post("/auth/login", authController.login.bind(authController));
  app.post("/auth/refresh-token", authController.refreshToken.bind(authController));
  app.post("/auth/forgot-password", authController.forgotPassword.bind(authController));
  app.get("/auth/validate-reset-token", authController.validateResetToken.bind(authController));
  app.post("/auth/reset-password", authController.resetPassword.bind(authController));

  // Protected routes
  app.get("/auth/profile", authenticate, authController.profile.bind(authController));

  // Documentation
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Health check
  app.get("/health", (req, res) => res.json({ status: "ok" }));

  return app;
}