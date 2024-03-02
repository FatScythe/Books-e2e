const errorHandlerMiddleware = async (err, req, res, next) => {
  /*
    Middleware: Catches all the unexpected errors 
    forward by the library "express-async-error", and 
    handles them by sending a concise response
   */

  let customErr = {
    statusCode: err.statusCode || 500,
    message:
      err.message ||
      "Something went wrong, our engineers are currently working on it",
  };

  // Catches all Database Validation Error
  if (err.name === "ValidationError") {
    customErr.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    customErr.statusCode = 400;
  }

  // Catches all Database Unique Constraint Error
  if (err.code && err.code === 11000) {
    customErr.message = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field(s), Please choose another value`;
    customErr.statusCode = 400;
  }

  if (err.name === "CastError") {
    customErr.message = `No item found with id : ${err.value}`;
    customErr.statusCode = 404;
  }

  res
    .status(customErr.statusCode)
    .json({ success: false, message: customErr.message });
};

module.exports = errorHandlerMiddleware;
