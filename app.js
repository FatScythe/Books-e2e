const express = require("express");
const morgan = require("morgan");
const routes = require("./routes");
const cookieParser = require("cookie-parser");

const app = express();

// Log request route
app.use(morgan("tiny"));
// Allows json request
app.use(express.json());
// Allow cookies to be parsed
app.use(cookieParser(process.env.JWT_SECRET));
// All Application Routes here
app.use("/", routes);

// Generic route to get server status
app.get("/health-check", (req, res) =>
  res.status(200).json({ success: true, message: "Everything is okay" })
);

// Middlewares to handle errors and not found routes
app.use(require("./middlewares/not-found"));
app.use(require("./middlewares/error-handler"));

module.exports = app;
