// Packages
import { ValidationError } from '@mikro-orm/postgresql';
import chalk from 'chalk';
import { type Request, type Response } from 'express';

// Utils
import { CustomError } from '../utils/error.util.js';
import { Logger } from '../utils/logger.util.js';


export const handleError = (
  error: Error | CustomError,
  logger: Logger,
  request: Request,
  response: Response
): void => {
  const errorMessage = `
    ----------------------------------
    EXCEPTION MIDDLEWARE
    REQUEST: ${request.method} ${request.url}
    REQUEST HEADERS: ${JSON.stringify(request.headers)}
    REQUEST BODY: ${JSON.stringify(request.body)}
    STATUS: ${error instanceof CustomError ? error.status : response.statusCode}
    MESSAGE: ${error.message}
    STACK: ${error.stack ?? ''}
    ----------------------------------
  `;

  // Logs In Console Only In Development Mode
  if (process.env['NODE_ENV'] === 'development') {
    process.stdout.write(chalk.redBright(errorMessage));
  }

  if (error instanceof CustomError) {
    response
      .status(error.status)
      .json({
        error: error.message,
        status: error.status
      });
  } else {
    // Logs Database Exceptions
    if (error instanceof ValidationError) {
      logger.error(error);
    }
    response
      .status(500)
      .json({
        error: 'Internal Server Error'
      });
  }
};
