const { Pool } = require('pg');
require('dotenv').config();

// Conexão via DATABASE_URL (recomendado pela Neon)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;
const { Pool } = require('pg');
require('dotenv').config(); 

module.exports = pool;
