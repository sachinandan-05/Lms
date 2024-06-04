class errorHandler extends Error {
  statusCode: Number;

  constructor(message: any, statuscode: number) {
    super(message);
    this.statusCode = statuscode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default errorHandler;
