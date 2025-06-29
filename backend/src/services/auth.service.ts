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

  async register(email: string, password: string): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new Error("Email já em uso");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      role: "user",
    });

    await this.userRepository.save(user);
    return user;
  }

  async login(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new Error("Email ou senha errados");

    if (user.blockExpires && user.blockExpires > new Date()) {
      throw new Error(
        "Conta temporariamente bloqueada devido a muitas tentativas mal sucedidas"
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      user.loginAttempts += 1;
      if (user.loginAttempts >= 5) {
        user.blockExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 min
      }
      await this.userRepository.save(user);
      throw new Error("Email ou senha errados");
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
      role: user.role,
    };

    const secret = process.env.JWT_ACCESS_SECRET as string;
    if (!secret) throw new Error("JWT_ACCESS_SECRET não está definida");

    const expiresIn = (process.env.ACCESS_TOKEN_EXPIRES_IN ||
      "15m") as SignOptions["expiresIn"];

    return jwt.sign(payload, secret, { expiresIn });
  }

  private generateRefreshToken(user: User): string {
    const payload = { userId: user.id };

    const secret = process.env.JWT_REFRESH_SECRET as string;
    if (!secret) throw new Error("JWT_REFRESH_SECRET não está definida");

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
      if (!user) throw new Error("Usuário não encontardo");

      return { accessToken: this.generateAccessToken(user) };
    } catch (error) {
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

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await transporter.sendMail({
      from: `"Papo Popular" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Redefinir senha",
      html: `
        <p>Você solicitou uma redefinição de senha para sua conta do Papo Popular.</p>
        <p>Clique no link abaxo para redefinir a senha:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Se você não pediu isso, apenas desconsidere esse email.</p>
        <p>O link expira em 30 minutos.</p>
      `,
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: {
        resetPasswordToken: token,
        resetTokenExpiry: MoreThan(new Date()),
      },
    });

    if (!user) throw new Error("Token invalido ou expirado");

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
