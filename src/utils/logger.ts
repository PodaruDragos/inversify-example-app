// Packages
import { existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import BunyanLogger from 'bunyan';

// Utils
import { ProvideSingleton } from './decorator.js';

// Inversify Types
import { TYPES } from '../types/index.js';

const rootDir: string = resolve('../../');
const logsDirectory = `${rootDir}/logs`;

if (!existsSync(logsDirectory)) {
  mkdirSync(logsDirectory);
}


@ProvideSingleton(TYPES.LOGGER)
export class Logger {
  public errorLogger: BunyanLogger;
  public infoLogger: BunyanLogger;

  constructor() {
    this.errorLogger = BunyanLogger.createLogger(
      {
        name: 'error-logger',
        streams: [
          {
            level: 'error',
            path: `${logsDirectory}/error.json`
          }
        ]
      }
    );
    this.infoLogger = BunyanLogger.createLogger(
      {
        name: 'info-logger',
        streams: [
          {
            level: 'info',
            path: `${logsDirectory}/info.json`
          }
        ]
      }
    );
  }

  public error(error: Error | string): void {
    this.errorLogger.error(error);
  }

  public info(info: string): void {
    this.infoLogger.info(info);
  }

}
