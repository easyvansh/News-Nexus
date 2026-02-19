class AppError extends Error {
  constructor(code, message, status = 500, details = {}) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

module.exports = { AppError };
