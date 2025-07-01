// src/controllers/post.controller.ts
import { Request, Response } from "express";
import { PostService } from "../services/post.service";

export class PostController {
  async create(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Usuário não autenticado." });
    }

    try {
      const result = await PostService.create(
        req.user.id,
        req.body.content,
        req.body.isPublic
      );
      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao criar post.", error });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const posts = await PostService.getAll();
      return res.json(posts);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar posts.", error });
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const post = await PostService.getOne(+req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post não encontrado." });
      }
      return res.json(post);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar post.", error });
    }
  }

  async update(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Usuário não autenticado." });
    }

    try {
      const updated = await PostService.update(
        +req.params.id,
        req.user.id,
        req.body
      );
      return res.json(updated);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro ao atualizar post.", error });
    }
  }

  async remove(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Usuário não autenticado." });
    }

    try {
      await PostService.remove(+req.params.id, req.user.id);
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ message: "Erro ao remover post.", error });
    }
  }
}
