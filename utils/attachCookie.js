const jwt = require("jsonwebtoken");

const attachCookieToResponse = (res, user) => {
  /*
    This Function attaches a user to a token 
    which is then sent with a cookie in the response body
  */

  const token = jwt.sign(
    { userId: user._id, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );

  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie("token", token, {
    expires: new Date(Date.now() + oneDay),
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === "production",
  });
};

module.exports = attachCookieToResponse;
