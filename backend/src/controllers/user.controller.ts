// src/controllers/user.controller.ts
import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";

export class UserController {
  async getUserById(req: Request, res: Response) {
    const userId = +req.params.id;
    const user = await AppDataSource.getRepository(User).findOne({
      where: { id: userId },
      select: ["id", "email", "name", "bio", "createdAt"], // só o público
    });

    if (!user)
      return res.status(404).json({ message: "Usuário não encontrado" });
    return res.json(user);
  }

  async updateProfile(req: Request, res: Response) {
    if (!req.user) return res.sendStatus(401);

    const { name, bio } = req.body;
    const repo = AppDataSource.getRepository(User);
    const user = await repo.findOneBy({ id: req.user.id });

    if (!user)
      return res.status(404).json({ message: "Usuário não encontrado" });

    user.name = name ?? user.name;
    user.bio = bio ?? user.bio;

    await repo.save(user);

    return res.json({ message: "Perfil atualizado com sucesso", user });
  }
}
