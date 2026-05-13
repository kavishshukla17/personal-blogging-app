const errorHandler = (err, req, res, next) => {
  let status = err.status || err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.name === "CastError") {
    status = 400;
    message = "Invalid resource id";
  }
  if (err.code === 11000) {
    status = 400;
    message = "Duplicate field value";
  }

  res.status(status).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
