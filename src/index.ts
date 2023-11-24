// Runtime Decorator Metadata Introspection
import 'reflect-metadata';

// Packages
import chalk from 'chalk';
import dotenv, { type DotenvConfigOutput } from 'dotenv';

// Aplication Server
import { App } from './app.js';

// IOC Container
import { IocContainer } from './config/ioc.js';

// Inversify Types
import { TYPES } from './types/index.js';


class Server {
  public static readonly iocContainer = new IocContainer();

  public async bootstrap(): Promise<void> {
    // Init The Application
    const app = Server.iocContainer.container.get<App>(TYPES.APP);
    try {
      await app.init(Server.iocContainer);
    } catch (error) {
      process.stdout.write(
        chalk.redBright(`${String(error)}`)
      );
    }
  }
}

// Load Config From .env File
const configResult: DotenvConfigOutput = dotenv.config();

if (configResult.error) {
  throw configResult.error;
}

// Start The Application
const server = new Server();
await server.bootstrap();

