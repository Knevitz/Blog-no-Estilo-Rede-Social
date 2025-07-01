// src/routes/comment.routes.ts
import { Router } from "express";
import { CommentController } from "../controllers/comment.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();
const controller = new CommentController();

router.post("/", authenticate, controller.create);
router.get("/post/:postId", controller.getByPost);
router.delete("/:id", authenticate, controller.remove);

export default router;
