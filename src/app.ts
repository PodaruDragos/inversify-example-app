// Native Packages
import { createServer, Server } from 'node:http';
import { cpus } from 'node:os';

// Packages
import { LoadStrategy, MikroORM, RequestContext } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import cors from 'cors';
import chalk from 'chalk';
import compression from 'compression';
import env from 'env-var';
import { type Application, json, type NextFunction, type Request, type Response, urlencoded } from 'express';
import helmet from 'helmet';
import { inject, injectable } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import morgan from 'morgan';

// Container
import { IocContainer } from './config/ioc.js';

// Middleware
import { handleError } from './middleware/error.js';

// Utils
import { CustomError } from './utils/error.util.js';
import { Logger } from './utils/logger.util.js';


// Inversify Types
import { TYPES } from './types/index.js';


@injectable()
export class App {

  protected app!: Application;
  protected inversifyServer!: InversifyExpressServer;
  protected server!: Server;

  constructor(
    @inject(TYPES.LOGGER)
    private readonly logger: Logger
  ) { }


  public async init(iocContainer: IocContainer): Promise<void> {
    let connection: MikroORM | null = null;

    // Tell libuv To Use Maximum Available CPU'S
    process.env['UV_THREAPOOL_SIZE'] = String(cpus().length);

    // App Specific Variables
    const APP_ROOT_PATH = env.get('APP_ROOT_PATH').required().asString();
    const APP_PORT = env.get('APP_PORT').required().asPortNumber();
    const NODE_ENV = env.get('NODE_ENV').required().asString();

    // Init Database Connection
    try {
      connection = await MikroORM.init({
        debug: NODE_ENV !== 'production' && true,
        extensions: [Migrator],
        loadStrategy: LoadStrategy.JOINED
      });

      // Run Migrations
      await connection.getMigrator().up();

      // Bind Connection and Entities Into Repositories
      iocContainer.bindDatabaseModules(connection);

    } catch (error) {
      this.logger.error(error);
      throw error;
    }

    // Create Inversify Server
    this.inversifyServer = new InversifyExpressServer(
      iocContainer.container,
      null,
      { rootPath: APP_ROOT_PATH }
    );

    this.inversifyServer.setConfig((app: Application): void => {
      // Use Morgan To Log Request Into The Console
      NODE_ENV !== 'production' && app.use(morgan('combined'));

      // Use Helmet To Add Different Security Headers To The Application
      // Hide Powered By To Make It Harder For Attackers To Detect What Server We Are Running
      app.use(helmet({
        crossOriginResourcePolicy: NODE_ENV !== 'production' ? false : true,
        hidePoweredBy: true,
      }));

      // Use Cross Origin Resourse Sharing
      app.use(cors());

      // Use Content-Encoding
      app.use(compression());

      // Parse JSON And URL Params
      app.use(json());
      app.use(urlencoded({ extended: false }));

      // Create Different Instances For Each Request
      app.use((
        _request: Request,
        _response: Response,
        next: NextFunction
      ): void => {
        if (connection) {
          RequestContext.create(connection.em, next);
        }
      });
    });

    // Use Exception Middleware To Log Exceptions
    // This Will Log Detailed Errors On The Server Console
    // Throw ( 500 || statusCode ) Back To The Client For Security Reasons
    this.inversifyServer.setErrorConfig((app: Application): void => {
      app.use((
        error: Error | CustomError,
        request: Request,
        response: Response,
        _: NextFunction,
      ): void => {
        handleError(error, this.logger, request, response);
      });
    });

    // Initialize Application
    this.app = this.inversifyServer.build();

    // Set Node Enviroment
    this.app.set('env', NODE_ENV);

    // Create HTTP Server
    this.server = createServer(this.app);

    // Start Server On APP_PORT
    this.server.listen(APP_PORT, (): void => {
      const message = `server started on port ${APP_PORT}!`;
      this.logger.info(message);
      process.stdout.write(chalk.greenBright(message));
    });
  }
}
