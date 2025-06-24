const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const authRoutes = require("./routes/routes");
const postRoutes = require("./routes/postRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

// Conexão com banco de dados (Neon)
const pool = new Pool({
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT),
  ssl: { rejectUnauthorized: false },
});

// Rotas
app.use("/auth", authRoutes);
app.use("/api", postRoutes);

// Health check
app.get("/health", (req, res) => res.sendStatus(200));

// Inicialização do servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = { app, pool };
