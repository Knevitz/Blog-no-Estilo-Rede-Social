// src/app.ts

import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json";

import authRoutes from "./routes/auth.routes";
import postRoutes from "./routes/post.routes";
import commentRoutes from "./routes/comment.routes";
import userRoutes from "./routes/user.routes";
import likeRoutes from "./routes/like.routes";
import feedRoutes from "./routes/feed.routes";

export function createApp() {
  const app = express();

  // Middlewares globais
  app.use(
    cors({
      origin: [
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://192.168.0.150:8080",
        "http://127.0.0.1:8080",
      ],
      credentials: true,
    })
  );
  app.use(express.json());
  app.use("/feed", feedRoutes);

  // Documentação Swagger
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Health check
  app.get("/health", (req, res) => res.json({ status: "ok" }));

  // Rotas públicas/autenticação
  app.use("/auth", authRoutes);

  // Rotas protegidas
  app.use("/users", userRoutes);
  app.use("/posts", postRoutes);
  app.use("/comments", commentRoutes);
  app.use("/likes", likeRoutes);

  return app;
}
