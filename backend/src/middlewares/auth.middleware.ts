import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../entities/User";
import { AppDataSource } from "../config/data-source";

declare module "express" {
  interface Request {
    user?: User;
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Token de autenticação não fornecido" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as {
      userId: number;
    };

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || "")) {
      return res.status(403).json({ message: "Acesso negado" });
    }
    next();
  };
};
