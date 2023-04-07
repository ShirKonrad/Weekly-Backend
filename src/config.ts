import { DataSource } from "typeorm";
import { User } from "./models/user";
import { Event } from "./models/event";
import { Task } from "./models/task";
import { Tag } from "./models/tag";

require('dotenv').config();

export const AppDataSource = new DataSource({
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