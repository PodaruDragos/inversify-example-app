// Packages
import dotenv, { DotenvConfigOutput } from 'dotenv';
import { Options } from '@mikro-orm/core';


const configResult: DotenvConfigOutput = dotenv.config();
if (configResult.error) {
  throw configResult.error;
}


const mikroOrmConfig: Options = {
  dbName: process.env.POSTGRE_DB,
  debug: process.env.APP_ENV === 'development',
  entities: ['bin/entities/*.js'],
  entitiesTs: ['src/entities/*.ts'],
  host: process.env.POSTGRE_HOST,
  migrations: {
    path: 'src/migrations/',
    tableName: 'migrationsHistory',
    transactional: true
  },
  password: process.env.POSTGRE_PASSWORD,
  port: Number(process.env.POSTGRE_PORT),
  tsNode: process.env.APP_ENV === 'development',
  type: 'postgresql',
  user: process.env.POSTGRE_USER
};

export default mikroOrmConfig;