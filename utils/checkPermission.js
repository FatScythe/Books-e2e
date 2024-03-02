const { UnauthorizedError } = require("../errors");

const checkPermissions = (requestUser, resourceUserId) => {
  /*
        This fn checks if the current request user, created this instance
        on the db, that wants to be mutated
        NB: Admins are authorized
    */
  if (requestUser.role === "admin") return;
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new UnauthorizedError(
    "Unauthorized to access resource(s) on this route"
  );
};

module.exports = checkPermissions;
