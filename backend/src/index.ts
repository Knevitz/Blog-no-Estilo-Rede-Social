import { AppDataSource } from "./config/data-source";
import { createApp } from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    const app = createApp();
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Erro de conexão no banco de dados:", error);
    process.exit(1);
  });
