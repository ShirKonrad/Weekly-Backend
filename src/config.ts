import { DataSource } from "typeorm";
import { User } from "./models/user";
import { Event } from "./models/event";
import { Task } from "./models/task";
import { Tag } from "./models/tag";

require('dotenv').config();

export const AppDataSource = new DataSource({
  host: "weekly.cs.colman.ac.il",
  database: "postgres",
  username: "postgres",
  password: "bartar20@CS",
  port: 5432,
  type: 'postgres',
  synchronize: false,
  logging: false,
  entities: [User, Event, Task, Tag],
});