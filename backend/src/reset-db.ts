import { AppDataSource } from "./config/data-source";

AppDataSource.initialize()
  .then(async () => {
    console.log("Resetando o banco de dados...");
    await AppDataSource.synchronize(true);
    console.log("Banco resetado com sucesso!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Erro ao resetar banco:", error);
    process.exit(1);
  });
