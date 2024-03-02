const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a user name"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
      unique: true,
    },
    password: {
      type: String,
      minLength: [8, "Password cannot be less than 8 characters"],
      required: [true, "Please provide a password"],
    },
    role: {
      type: String,
      enum: ["user", "author", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  /*
    This fn is triggered just before a instance of the model is save to the db,
    if the password is being inserted or change it trigger and hashes it before
    it is stored in the db
  */
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(this.password, salt);
  this.password = password;
});

UserSchema.methods.comparePassword = async function (candidatePwd) {
  /*
    This fn can e used with an instance of the user model,
    it takes in a string "password" and compares it with the password stored on the db
    It returns a boolean 
  */
  const isMatch = await bcrypt.compare(candidatePwd, this.password);
  return isMatch;
};

module.exports = model("Users", UserSchema);
