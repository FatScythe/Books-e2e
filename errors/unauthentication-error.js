const CustomApiError = require("./custom-error");

class UnauthenticatedError extends CustomApiError {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = UnauthenticatedError;
