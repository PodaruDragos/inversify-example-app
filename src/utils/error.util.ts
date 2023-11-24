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
