require("dotenv").config();
require("express-async-errors");
const app = require("./app");
const mongoose = require("mongoose");

const PORT = 5000 || process.env.PORT;
app.listen(PORT, async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Server is listening on port: " + PORT);
  } catch (error) {
    console.error("Cannot connect to database");
    console.error(error);
  }
});
