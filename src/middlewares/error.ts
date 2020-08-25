// Packages
import chalk from 'chalk';
import { Request, Response, NextFunction } from 'express';

// Utils
import { CustomError } from '../utils/error';


export const handleError = (
  error: Error | CustomError,
  request: Request,
  response: Response,
  _next: NextFunction
): void => {
  const errorMessage = `
    ----------------------------------
    EXCEPTION MIDDLEWARE
    REQUEST: ${request.method} ${request.url}
    REQUEST HEADERS: ${JSON.stringify(request.headers)}
    REQUEST BODY: ${JSON.stringify(request.body)}
    STATUS: ${error instanceof CustomError ? error.status : response.statusCode}
    MESSAGE: ${error.message}
    STACK: ${error.stack as string}
    ----------------------------------
  `;

  process.stdout.write(chalk.redBright(errorMessage));
  if (error instanceof CustomError) {
    response
      .status(error.status)
      .json({
        error: error.message,
        status: error.status
      });
  } else {
    response.status(500).json({ error: 'Internal server error' });
  }
};