import { Router } from "express";
import { LikeController } from "../controllers/like.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();
const controller = new LikeController();

router.post("/posts/:id/like", authenticate, controller.togglePostLike);
router.post("/comments/:id/like", authenticate, controller.toggleCommentLike);

export default router;
