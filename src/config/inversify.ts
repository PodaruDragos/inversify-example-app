/*
  Controllers
  All '@controller()' Classes Must Be Imported First
*/
import '../controllers/test';

// Packages
import { AsyncContainerModule, interfaces } from 'inversify';
import { Connection, GetRepository, IDatabaseDriver, MikroORM, EntityRepository } from '@mikro-orm/core';

// Clients
import { DatabaseClient } from './database';

// Entities
import { Test } from '../entities/Test';

// Inversify Types
import { TYPES } from '../types';


const bindEntityToRepository = <T, U>(
  bind: interfaces.Bind,
  binding: symbol,
  connection: MikroORM<IDatabaseDriver<Connection>>,
  entity: { new(...args: string[] & U): T; }
): void => {
  bind<GetRepository<T, EntityRepository<T>>>(binding)
    .toDynamicValue((): GetRepository<T, EntityRepository<T>> => {
      return connection.em.getRepository<T>(entity);
    })
    .inRequestScope();
};



export const bindings = new AsyncContainerModule(async (bind): Promise<void> => {
  // Initialize Database Client Connection
  const databaseClient: DatabaseClient = new DatabaseClient();
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