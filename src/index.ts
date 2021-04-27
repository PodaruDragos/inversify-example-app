// Runtime Decorator Metadata Insersion
import 'reflect-metadata';

// Packages
import cors from 'cors';
import compression from 'compression';
import dotenv, { DotenvConfigOutput } from 'dotenv';
import express, { Application, json, NextFunction, urlencoded } from 'express';
import fileUpload from 'express-fileupload';
import helmet from 'helmet';
import { InversifyExpressServer } from 'inversify-express-utils';
import { Connection, IDatabaseDriver, MikroORM, RequestContext } from '@mikro-orm/core';

// Container
import { IocContainer } from './config/ioc.js';

// Middlewares
import { handleError } from './middlewares/error.js';
import { TYPES } from './types/index.js';

// Inversify Types
import { Logger } from './utils/logger.js';


export class Server {
  protected app: Application | undefined;
  protected server: InversifyExpressServer;
  protected iocContainer: IocContainer;
  protected readonly logger: Logger;

  constructor() {
    this.iocContainer = new IocContainer();
    this.logger = this.iocContainer.container.get(TYPES.LOGGER);

    // Load Config From .env File
    const configResult: DotenvConfigOutput = dotenv.config();

    if (configResult.error) {
      this.logger.error(configResult.error);
    }

    this.server = new InversifyExpressServer(
      this.iocContainer.container,
      null,
      {
        rootPath: process.env.APP_ROOT_PATH as string
      }
    );
  }

  public async init(): Promise<void> {
    await this.iocContainer.container.loadAsync(this.iocContainer.loadModules());

    this.server.setConfig((app: Application): void => {
      // Use Helmet To Add Different Security Headers To The Application
      app.use(helmet());

      // Use Cross Origin Resourse Sharing
      app.use(cors());

      // Use Content-Encoding
      app.use(compression());

      // Parse JSON And URL Params
      app.use(json());
      app.use(urlencoded({ extended: false }));

      // Parse MultiPart/Form-Data
      app.use(fileUpload({
        abortOnLimit: true,
        limits: { fileSize: 20 * 1024 * 1024 }
      }));

      // Use Static To Access Images Via URL
      app.use(express.static(process.env.APP_STATIC_PATH as string));

      // Create Different Instances For Each Request
      app.use((_req, _res, next: NextFunction): void => {
        const connection = this.iocContainer.container.get<MikroORM<IDatabaseDriver<Connection>>>
          (TYPES.DATABASE_CONNECTION);
        RequestContext.create(connection.em, next);
      });
    });

    // Use Exception Middleware To Log Exceptions
    // This Will Log Detailed Errors On The Server Console
    // Throw ( 500 || statusCode ) Back To The Client For Security Reasons
    this.server.setErrorConfig((app: Application): void => {
      app.use(handleError);
    });

    // Initialize Application
    this.app = this.server.build();

    // Set Node Enviroment
    this.app.set('env', process.env.APP_ENV);

    // Start Server On A Port
    this.app.listen(process.env.APP_PORT, (): void => {
      this.logger.info(`server started on port ${process.env.APP_PORT as string}!\n`);
      process.stdout.write(`server started on port ${process.env.APP_PORT as string}!\n`);
    });
  }

}

const server = new Server();
await server.init();
