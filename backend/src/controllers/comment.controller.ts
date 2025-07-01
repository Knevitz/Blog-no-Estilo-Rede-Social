import { Request, Response } from "express";
import { CommentService } from "../services/comment.service";

export class CommentController {
  async create(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Usuário não autenticado." });
    }

    const { content, postId, parentId } = req.body;

    try {
      const comment = await CommentService.create(
        req.user.id,
        postId,
        content,
        parentId
      );
      return res.status(201).json(comment);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro ao criar comentário.", error });
    }
  }

  async getByPost(req: Request, res: Response) {
    const postId = +req.params.postId;

    try {
      const comments = await CommentService.getByPost(postId);
      return res.json(comments);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro ao buscar comentários.", error });
    }
  }

  async remove(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Usuário não autenticado." });
    }

    const id = +req.params.id;

    try {
      await CommentService.remove(id, req.user.id);
      return res.status(204).send();
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro ao remover comentário.", error });
    }
  }
}
