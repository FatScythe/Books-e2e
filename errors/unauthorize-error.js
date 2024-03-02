const CustomApiError = require("./custom-error");

class UnauthorizedError extends CustomApiError {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = UnauthorizedError;
