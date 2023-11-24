/*
  Controllers
  All '@controller()' Classes Must Be Imported First
*/
import '../controllers/test.js';

// Packages
import { Container } from 'inversify';
import type { EntityManager, MikroORM } from '@mikro-orm/postgresql';

// Server
import { App } from '../app.js';

// Services
import { TestService } from '../services/test.js';

// Utils
import { Logger } from '../utils/logger.util.js';

// Inversify Types
import { TYPES } from '../types/index.js';


export class IocContainer {
  public readonly container: Container;

  constructor() {
    this.container = new Container();

    // App
    this.container.bind<App>(TYPES.APP).to(App).inSingletonScope();

    // Logger
    this.container.bind<Logger>(TYPES.LOGGER).to(Logger).inSingletonScope();

    // Services
    this.container.bind<TestService>(TYPES.TEST_SERVICE)
      .to(TestService)
      .inRequestScope();
  }

  public bindDatabaseModules(
    databaseConnection: MikroORM
  ): void {
    // Connection Bindings
    this.container
      .bind<MikroORM>(TYPES.DATABASE_CONNECTION)
      .toConstantValue(databaseConnection);

    // Entity Manager
    this.container
      .bind<EntityManager>(TYPES.ENTITY_MANAGER)
      .toConstantValue(databaseConnection.em);
  }
}
