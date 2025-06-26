const { Pool } = require('pg');
require('dotenv').config();

// Conexão usando DATABASE_URL da Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

module.exports = pool;
