const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Middlewares
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

// Rotas
const authRoutes = require('./routes/routes');       // Registro de usuários
const postRoutes = require('./routes/postRoutes');   // Posts de usuários

app.use('/auth', authRoutes);
app.use('/api', postRoutes);

// Rota de saúde
app.get('/health', (req, res) => res.sendStatus(200));

// Inicializa o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
