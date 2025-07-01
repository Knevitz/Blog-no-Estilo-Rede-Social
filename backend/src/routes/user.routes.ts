// src/routes/user.routes.ts
import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();
const controller = new UserController();

router.get("/:id", authenticate, controller.getUserById.bind(controller));
router.put("/me", authenticate, controller.updateProfile.bind(controller));

export default router;
