// Native Packages
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Packages
import env from 'env-var';
import { injectable } from 'inversify';
import BunyanLogger, { RotatingFileStream } from 'bunyan';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir: string = resolve(__dirname, '../../');
const logsDirectory = `${rootDir}/logs`;

if (!existsSync(logsDirectory)) {
  mkdirSync(logsDirectory);
}

@injectable()
export class Logger {
  public errorLogger: BunyanLogger;
  public infoLogger: BunyanLogger;

  constructor() {
    this.errorLogger = BunyanLogger.createLogger(
      {
        name: 'error-logger',
        streams: [{
          stream: new RotatingFileStream({
            count: env.get('LOGGER_COUNT').required().asIntPositive(),
            path: `${logsDirectory}/error.json`,
            period: env.get('LOGGER_PERIOD').required().asString()
          })
        }]
      }
    );

    this.infoLogger = BunyanLogger.createLogger(
      {
        name: 'info-logger',
        streams: [
          {
            closeOnExit: true,
            level: 'info',
            path: `${logsDirectory}/info.json`
          }
        ]
      }
    );
  }

  public error(error: unknown): void {
    this.errorLogger.error(error);
  }

  public info(info: string): void {
    this.infoLogger.info(info);
  }

}
