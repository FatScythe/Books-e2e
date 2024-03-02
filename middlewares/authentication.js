const jwt = require("jsonwebtoken");
const {
  UnauthenticatedError,
  UnauthorizedError,
  BadRequestError,
} = require("../errors");

const authenticateUser = async (req, res, next) => {
  /*
    Middleware: Verifies requeest token,
    extract user from the token and attaches said user on the request object
*/
  const token = req.signedCookies.token;
  try {
    if (!token) {
      throw new BadRequestError("Invalid Credentials!");
    }

    const { userId, name, role } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId, name, role };
    next();
  } catch {
    throw new UnauthenticatedError("Invalid Credentials!");
  }
};

const authorizePermissions = (...roles) => {
  /*
    NB: Only to be used after the authenticateUser middleware
    Middleware: Accept argument(s) of roles, and 
    checks if the request user belongs to the role(s)
*/
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      throw new UnauthorizedError("Unauthorized to access the resource(s)");

    next();
  };
};

module.exports = { authenticateUser, authorizePermissions };
