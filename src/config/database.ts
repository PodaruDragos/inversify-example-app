// Packages
import { Connection, IDatabaseDriver, MikroORM } from '@mikro-orm/core';
import chalk from 'chalk';

// Config
import mikroOrmConfig from './mikro-orm.config';


export class DatabaseClient {
  public connect = async (): Promise<MikroORM<IDatabaseDriver<Connection>> | void> => {
    try {
      return MikroORM.init(mikroOrmConfig);
    } catch (error) {
      process.stdout.write(
        chalk.redBright(`${(error as Error).message}\n`)
      );
    }
  }

}