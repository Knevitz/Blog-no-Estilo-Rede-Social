// src/routes/post.routes.ts
import { Router } from "express";
import { PostController } from "../controllers/post.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();
const controller = new PostController();

router.post("/", authenticate, controller.create);
router.get("/", controller.getAll);
router.get("/:id", controller.getOne);
router.put("/:id", authenticate, controller.update);
router.delete("/:id", authenticate, controller.remove);

export default router;
