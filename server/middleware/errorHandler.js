const { AppError } = require("../utils/errors");

const notFoundHandler = (_req, _res, next) => {
  next(new AppError("NOT_FOUND", "Route not found", 404));
};

const errorHandler = (error, _req, res, _next) => {
  const status = error.status || 500;
  const code = error.code || "INTERNAL_ERROR";
  const message = error.message || "Something went wrong";
  const details = error.details || {};

  res.status(status).json({
    error: {
      code,
      message,
      details,
    },
  });
};

module.exports = { notFoundHandler, errorHandler };
