const CustomApiError = require("./custom-error");
const BadRequestError = require("./badrequest-error");
const NotFoundError = require("./notfound-error");
const UnauthenticatedError = require("./unauthentication-error");
const UnauthorizedError = require("./unauthorize-error");

module.exports = {
  BadRequestError,
  CustomApiError,
  NotFoundError,
  UnauthenticatedError,
  UnauthorizedError,
};
