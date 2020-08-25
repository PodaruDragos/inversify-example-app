// Packages
import { existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { TransformableInfo } from 'logform';
import winston, { Logger as WinstonLogger, format, transports } from 'winston';
import { FileTransportOptions } from 'winston/lib/winston/transports';

// Utils
import { ProvideSingleton } from './decorator';

// Inversify Types
import { TYPES } from '../types';

interface WinstonLoggerOptions {
  file: FileTransportOptions;
}

// Log Types
type LOGTYPE = {
  'info': 'info';
  'error': 'error';
}

// Default Configs
const rootDir: string = resolve(__dirname, '../../');
const logsDirectory = `${rootDir}/logs`;
const maxsize = 5242880;

// Check To See If '/logs' Folder Exists
if (!existsSync(logsDirectory)) {
  mkdirSync(logsDirectory);
}

// Transform The Output Into More Readable String
const formatFunction = (info: TransformableInfo): string => {
  const firstCharacter = info.level.charAt(0).toUpperCase();
  const infoLevelWithFirstCapitalLetter: string = firstCharacter + info.level.slice(1);
  return (
    `
      ${infoLevelWithFirstCapitalLetter} Timestamp: 
      ${new Date().toISOString()}\n${infoLevelWithFirstCapitalLetter}: 
      ${info.message.trim()}\n\n
    `
  );
};


@ProvideSingleton(TYPES.LOGGER)
export class Logger {
  public logger: WinstonLogger;
  #options: WinstonLoggerOptions;

  constructor() {

    this.#options = {
      file: {
        level: 'debug',
        maxFiles: 5,
        maxsize
      }
    };

    this.logger = winston.createLogger({
      exitOnError: false,
      format: format
        .combine(
          format.timestamp(),
          format.align(),
          format.printf(formatFunction)
        ),
      transports: [
        new transports.File(
          Object.assign(
            this.#options.file, {
            filename: `${logsDirectory}/info.log`,
            handleExceptions: false,
            level: 'info',
            name: 'info'
          })
        ),
        new transports.File(
          Object.assign(
            this.#options.file, {
            filename: `${logsDirectory}/error.log`,
            handleExceptions: true,
            level: 'error',
            name: 'error'
          })
        )
      ]
    });

  }

  public log(error: Error, type: keyof LOGTYPE): void {
    this.logger.log(type, error.message);
  }

}