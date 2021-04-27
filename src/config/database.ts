// Packages
import { Connection, IDatabaseDriver, MikroORM } from '@mikro-orm/core';

// Utils
import { ProvideSingleton } from '../utils/decorator.js';
import { Logger } from '../utils/logger.js';

// Inversify Types
import { TYPES } from '../types/index.js';


@ProvideSingleton(TYPES.DATABASE_CLIENT)
export class DatabaseClient {

  constructor(
    public readonly logger: Logger
  ) { }

  public connect = async (): Promise<MikroORM<IDatabaseDriver<Connection>> | void> => {
    try {
      return MikroORM.init();
    } catch (error) {
      this.logger.error(error);
    }
  }
}
