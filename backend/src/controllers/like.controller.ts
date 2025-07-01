import { Request, Response } from "express";
import { LikeService } from "../services/like.service";

export class LikeController {
  private service = new LikeService();

  togglePostLike = async (req: Request, res: Response) => {
    const user = req.user!;
    const postId = Number(req.params.id);

    const result = await this.service.togglePostLike(postId, user);
    res.json(result);
  };

  toggleCommentLike = async (req: Request, res: Response) => {
    const user = req.user!;
    const commentId = Number(req.params.id);

    const result = await this.service.toggleCommentLike(commentId, user);
    res.json(result);
  };
}
