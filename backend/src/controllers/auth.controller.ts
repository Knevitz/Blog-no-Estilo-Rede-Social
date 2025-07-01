import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import {
  LoginDTO,
  RegisterDTO,
  ResetPasswordDTO,
  RefreshTokenDTO,
} from "../dto/auth.dto";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async register(req: Request, res: Response) {
    try {
      const registerDTO = plainToClass(RegisterDTO, req.body);
      const errors = await validate(registerDTO);

      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const user = await this.authService.register(
        registerDTO.email,
        registerDTO.username,
        registerDTO.password,
        registerDTO.name
      );

      return res.status(201).json({
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
      });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const loginDTO = plainToClass(LoginDTO, req.body);
      const errors = await validate(loginDTO);

      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const tokens = await this.authService.login(
        loginDTO.email,
        loginDTO.password
      );
      return res.json(tokens);
    } catch (error: any) {
      return res.status(401).json({ message: error.message });
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const refreshDTO = plainToClass(RefreshTokenDTO, req.body);
      const errors = await validate(refreshDTO);

      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const { accessToken } = await this.authService.refreshToken(
        refreshDTO.refreshToken
      );
      return res.json({ accessToken });
    } catch (error: any) {
      return res.status(401).json({ message: error.message });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "E-mail não fornecido" });
      }

      await this.authService.forgotPassword(email);
      return res.json({
        message:
          "Se o e-mail estiver registrado, você receberá um link para redefinir sua senha.",
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error.message || "Erro ao processar solicitação" });
    }
  }

  async validateResetToken(req: Request, res: Response) {
    try {
      const { token } = req.query;
      if (!token) {
        return res.status(400).json({ message: "Token não fornecido" });
      }

      const isValid = await this.authService.validateResetToken(
        token as string
      );
      return res.json({ valid: isValid });
    } catch (error: any) {
      return res
        .status(400)
        .json({ message: error.message || "Token inválido." });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const resetPasswordDTO = plainToClass(ResetPasswordDTO, req.body);
      const errors = await validate(resetPasswordDTO);

      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      await this.authService.resetPassword(
        resetPasswordDTO.token,
        resetPasswordDTO.newPassword
      );
      return res.json({ message: "Senha trocada com sucesso" });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async profile(req: Request, res: Response) {
    return res.json({
      id: req.user?.id,
      email: req.user?.email,
      username: req.user?.username,
      name: req.user?.name,
      role: req.user?.role,
    });
  }
}
