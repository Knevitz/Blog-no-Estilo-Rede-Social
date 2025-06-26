const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Rota de registro de novo usuário
router.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    // Validações básicas
    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    if (senha.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres' });
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return res.status(400).json({ error: 'E-mail inválido' });
    }

    // Verifica se e-mail já existe
    const existingUser = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'E-mail já registrado' });
    }

    // Hash da senha
    const hash = await bcrypt.hash(senha, 10);

    // Inserção no banco
    const result = await pool.query(
      'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *',
      [nome, email, hash]
    );

    res.status(201).json({ message: 'Usuário registrado com sucesso!', usuario: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});
// Rota de login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Verifica se o usuário existe
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    const usuario = result.rows[0];

    if (!usuario) {
      return res.status(401).json({ error: 'E-mail ou senha inválidos' });
    }

    // Verifica se a senha está correta
    const isMatch = await bcrypt.compare(senha, usuario.senha);
    if (!isMatch) {
      return res.status(401).json({ error: 'E-mail ou senha inválidos' });
    }

    // Gera o token JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    res.json({ message: 'Login realizado com sucesso!', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});
module.exports = router;
