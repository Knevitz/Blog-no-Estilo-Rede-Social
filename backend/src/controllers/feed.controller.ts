import { Request, Response } from "express";
import { FeedService } from "../services/feed.service";

export class FeedController {
  async getFeed(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Não autenticado" });

    const skip = Number(req.query.skip) || 0;
    const take = Number(req.query.take) || 20;

    try {
      const posts = await FeedService.getFeed(userId, skip, take);
      return res.json(posts);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar feed" });
    }
  }
}
