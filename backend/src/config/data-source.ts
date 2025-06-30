import { DataSource } from "typeorm";
import { User } from "../entities/User";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: process.env.NODE_ENV !== "production",
  logging: process.env.NODE_ENV === "development",
  entities: [User],
  migrations: [],
  subscribers: [],
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
