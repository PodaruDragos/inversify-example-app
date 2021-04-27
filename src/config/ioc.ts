/*
  Controllers
  All '@controller()' Classes Must Be Imported First
*/
import '../controllers/test.js';

// Packages
import { AsyncContainerModule, Container, interfaces } from 'inversify';
import { buildProviderModule } from 'inversify-binding-decorators';
import { Connection, GetRepository, EntityRepository, IDatabaseDriver, MikroORM } from '@mikro-orm/core';

// Clients
import { DatabaseClient } from './database.js';

// Entities
import { Test } from '../entities/Test.js';

// Utils
import { Logger } from '../utils/logger.js';

// Inversify Types
import { TYPES } from '../types/index.js';


const bindEntityToRepository = <T>(
  bind: interfaces.Bind,
  binding: symbol,
  connection: MikroORM<IDatabaseDriver<Connection>>,
  entity: { new(...args: string[]): T; }
): void => {
  bind<GetRepository<T, EntityRepository<T>>>(binding)
    .toDynamicValue((): GetRepository<T, EntityRepository<T>> => {
      return connection.em.getRepository<T>(entity);
    })
    .inRequestScope();
};

export class IocContainer {
  public container: Container;

  constructor() {
    this.container = new Container();
    this.container.load(buildProviderModule());
  }

  public loadModules(): AsyncContainerModule {
    return new AsyncContainerModule(async (bind): Promise<void> => {
      // Initialize Database Client Connection
      const databaseClient: DatabaseClient = new DatabaseClient(
        this.container.get<Logger>(TYPES.LOGGER)
      );

      const connection = await databaseClient.connect();
      if (connection) {
        // Run Migrations
        await connection.getMigrator().up();

        // Connection Bindings
        bind<MikroORM<IDatabaseDriver<Connection>>>(TYPES.DATABASE_CONNECTION)
          .toConstantValue(connection);

        // Repository Bindings
        bindEntityToRepository(bind, TYPES.TEST_REPOSITORY, connection, Test);
      }
    });
  }

}
