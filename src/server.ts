// Runtime Decorator Metadata Insersion
import 'reflect-metadata';

// Packages
import bodyParser from 'body-parser';
import chalk from 'chalk';
import cors from 'cors';
import compression from 'compression';
import dotenv, { DotenvConfigOutput } from 'dotenv';
import express, { Application, NextFunction } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { Connection, IDatabaseDriver, MikroORM, RequestContext } from '@mikro-orm/core';

// Inversify
import { Container } from 'inversify';
import { buildProviderModule } from 'inversify-binding-decorators';
import { InversifyExpressServer } from 'inversify-express-utils';
import { bindings } from './config/inversify';

// Middlewares
import { handleError } from './middlewares/error';

// Inversify Types
import { TYPES } from './types';


export class Server {
  protected app: Application | undefined;
  protected server: InversifyExpressServer | undefined;

  constructor() {

    // Load Config From .env File
    const configResult: DotenvConfigOutput = dotenv.config();

    if (configResult.error) {
      throw configResult.error;
    }

    this
      .#initContainer()
      .then(
        (container: Container): void => {
          // Initialize Express Application
          this.server = new InversifyExpressServer(
            container,
            null,
            {
              rootPath: process.env.APP_ROOT_PATH as string
            }
          );

          this.server.setConfig((app: express.Application): void => {
            // Use Helmet To Add Different Security Headers To The Application
            app.use(helmet());

            // Use Cross Origin Resourse Sharing
            app.use(cors());

            // Use Content-Encoding 
            app.use(compression());

            // Use 'bodyParser' To Parse JSON And URL Params
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({ extended: false }));

            // Use Static
            app.use(express.static(process.env.APP_STATIC_PATH as string));

            // Logger Middleware
            process.env.APP_ENV === 'development' && app.use(morgan('dev'));

            // Create Different Instances For Each Request
            app.use((_req, _res, next: NextFunction): void => {
              const connection = container.get<MikroORM<IDatabaseDriver<Connection>>>
                (TYPES.DATABASE_CONNECTION);
              RequestContext.create(connection.em, next);
            });

          });

          // Use Exception Middleware To Log Exceptions
          // This Will Log Detailed Errors On The Server Console
          // Throw ( 500 || statusCode ) Back To The Client For Security Reasons
          this.server.setErrorConfig((app: express.Application): void => {
            app.use(handleError);
          });

          // Initialize Application
          this.app = this.server.build();

          // Set Node Enviroment
          this.app.set('env', process.env.APP_ENV);

          // Start Server On A Port
          this.app.listen(process.env.APP_PORT, (): void => {
            process.stdout.write(
              chalk.greenBright(`server started on port ${process.env.APP_PORT as string}!\n`)
            );
          });
        }
      )
      .catch(
        (error: Error): void => {
          process.stdout.write(
            chalk.redBright(`${error.message}\n`)
          );
        }
      );
  }

  #initContainer = async (): Promise<Container> => {
    // Initialize Inversify Container With Async Bindings
    const container = new Container();
    await container.loadAsync(bindings);

    /*
      Binds All @provide Classes Into Inversify Container
      Also It Binds The Custom @provideSingleton Classes
    */
    container.load(buildProviderModule());
    return container;
  }
}