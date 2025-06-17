import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Pool } from "pg";
import bcrypt from "bcrypt";
import authRoutes from "./routes/routes";

dotenv.config();

const app = express();

// Database connection
const pool = new Pool({
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT),
  ssl: {
    rejectUnauthorized: false,
  },
});

// Routes
app.use("/auth", authRoutes);

// Health check
app.get("/health", (req, res) => res.sendStatus(200));

export { app, pool };
