import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { State } from './entity/State';
import { City } from './entity/City';
import dotenv from 'dotenv';
import { Address } from './entity/Address';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: 3306,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_SCHEMA,
  synchronize: true,
  logging: true,
  entities: [State, City, Address],
  migrations: [],
  subscribers: [],
});
