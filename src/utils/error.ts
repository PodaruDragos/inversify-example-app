// Models
import { ErrorStatusEnum } from '../models/error';

/*
  Error Class For Throwing Business Errors
  Handles App / User Errors
  Different From The Main Error Class Which Deals With 'node.js' Errors
*/
export class CustomError extends Error {
  public status: number;

  constructor(
    message: string,
    status: number
  ) {
    super(message);
    this.status = status;
  }
}

export class UnAuthorizedError extends CustomError {
  constructor(
    message = 'UnAuthorized',
    status: number = ErrorStatusEnum.UNAUTHORIZED
  ) {
    super(message, status);
  }
}