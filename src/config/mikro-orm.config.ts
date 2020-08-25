// Packages
import dotenv, { DotenvConfigOutput } from 'dotenv';
import { Options } from '@mikro-orm/core';


const configResult: DotenvConfigOutput = dotenv.config();
if (configResult.error) {
  throw configResult.error;
}


const mikroOrmConfig: Options = {
  dbName: process.env.POSTGRES_DB,
  debug: process.env.APP_ENV === 'development',
  entities: ['bin/entities/*.js'],
  entitiesTs: ['src/entities/*.ts'],
  host: process.env.POSTGRES_HOST,
  migrations: {
    path: 'src/migrations/',
    tableName: 'migrationsHistory',
    transactional: true
  },
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT),
  tsNode: process.env.APP_ENV === 'development',
  type: 'postgresql',
  user: process.env.POSTGRES_USER
};

export default mikroOrmConfig;