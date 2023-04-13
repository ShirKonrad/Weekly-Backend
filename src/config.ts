import { DataSource } from "typeorm";
import { User } from "./models/user";
import { Event } from "./models/event";
import { Task } from "./models/task";
import { Tag } from "./models/tag";
import { DatabaseConnectionError } from "./errors/databaseConnectionError";

require('dotenv').config();

const AppDataSource = new DataSource({
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  port: +process.env.POSTGRES_PORT!,
  type: 'postgres',
  synchronize: false,
  logging: false,
  entities: [User, Event, Task, Tag],
});

export const connectToDb = async () => {
  await AppDataSource.initialize().catch((error) => {
    console.log(error);
    throw new DatabaseConnectionError();
  });
  console.log("Connected to database");
};