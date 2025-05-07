import pgPromise from 'pg-promise';
import dotenv from 'dotenv';

dotenv.config();

const pgp = pgPromise();

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'delicado',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'patrumai11',
};

export const db = pgp(config);
