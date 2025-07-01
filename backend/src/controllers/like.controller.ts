// src/controllers/like.controller.ts
import { Request, Response } from "express";
import { LikeService } from "../services/like.service";

export class LikeController {
  async togglePostLike(req: Request, res: Response) {
    const userId = req.user!.id;
    const postId = Number(req.params.id);

    try {
      const result = await LikeService.togglePostLike(userId, postId);
      res.json({ message: result });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async toggleCommentLike(req: Request, res: Response) {
    const userId = req.user!.id;
    const commentId = Number(req.params.id);

    try {
      const result = await LikeService.toggleCommentLike(userId, commentId);
      res.json({ message: result });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
