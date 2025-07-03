import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { User } from "../entities/User";
import { AppDataSource } from "../config/data-source";
import { Repository, MoreThan } from "typeorm";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export class AuthService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async register(
    email: string,
    username: string,
    password: string,
    name?: string,
    bio?: string
  ): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existingUser) {
      throw new Error("Email ou nome de usuário já em uso");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = this.userRepository.create({
      email,
      username,
      name,
      bio,
      password: hashedPassword,
      role: "user",
    });

    return await this.userRepository.save(newUser);
  }

  async login(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new Error("Email ou senha incorretos");

    if (user.blockExpires && user.blockExpires > new Date()) {
      throw new Error(
        "Conta temporariamente bloqueada por tentativas inválidas"
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      user.loginAttempts += 1;

      if (user.loginAttempts >= 5) {
        user.blockExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos
      }

      await this.userRepository.save(user);
      throw new Error("Email ou senha incorretos");
    }

    user.loginAttempts = 0;
    user.blockExpires = null;
    await this.userRepository.save(user);

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return { accessToken, refreshToken };
  }

  private generateAccessToken(user: User): string {
    const payload = {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) throw new Error("JWT_ACCESS_SECRET não definida");

    const expiresIn = (process.env.ACCESS_TOKEN_EXPIRES_IN ||
      "15m") as SignOptions["expiresIn"];

    return jwt.sign(payload, secret, { expiresIn });
  }

  private generateRefreshToken(user: User): string {
    const payload = { userId: user.id };

    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) throw new Error("JWT_REFRESH_SECRET não definida");

    const expiresIn = (process.env.REFRESH_TOKEN_EXPIRES_IN ||
      "7d") as SignOptions["expiresIn"];

    return jwt.sign(payload, secret, { expiresIn });
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string
      ) as { userId: number };

      const user = await this.userRepository.findOne({
        where: { id: payload.userId },
      });
      if (!user) throw new Error("Usuário não encontrado");

      return { accessToken: this.generateAccessToken(user) };
    } catch {
      throw new Error("Token de atualização inválido");
    }
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) return;

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 min

    await this.userRepository.save(user);
    await this.sendResetEmail(user.email, resetToken);
  }

  private async sendResetEmail(email: string, token: string): Promise<void> {
    if (process.env.NODE_ENV === "test") return;

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === "true", // ajuste se usar TLS/SSL
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

      await transporter.sendMail({
        from: `"Papo Popular" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Redefinição de senha",
        html: `
        <p>Você solicitou uma redefinição de senha para sua conta no Papo Popular.</p>
        <p>Clique no link abaixo para redefinir sua senha:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Esse link expirará em 30 minutos.</p>
      `,
      });

      console.log(`E-mail de redefinição enviado para ${email}`);
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error);
      throw new Error("Falha no envio do e-mail de redefinição");
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: {
        resetPasswordToken: token,
        resetTokenExpiry: MoreThan(new Date()),
      },
    });

    if (!user) throw new Error("Token inválido ou expirado");

    user.password = await bcrypt.hash(newPassword, 12);
    user.resetPasswordToken = null;
    user.resetTokenExpiry = null;

    await this.userRepository.save(user);
  }

  async validateResetToken(token: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: {
        resetPasswordToken: token,
        resetTokenExpiry: MoreThan(new Date()),
      },
    });

    return !!user;
  }
}
