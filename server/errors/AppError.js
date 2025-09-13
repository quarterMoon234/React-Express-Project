export default class AppError extends Error {
  constructor(status = 500, message = "Internal Server Error") {
    super(message);
    this.status = status;
    Error.captureStackTrace?.(this, this.constructor);  
  }
}
