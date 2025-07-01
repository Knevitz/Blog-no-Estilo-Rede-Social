import { Router } from "express";
import { FeedController } from "../controllers/feed.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();
const feedController = new FeedController();

router.get("/", authenticate, feedController.getFeed.bind(feedController));

export default router;
