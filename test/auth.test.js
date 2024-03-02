const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");

require("dotenv").config();

/* Connecting to the database before each test. */
beforeAll((done) => {
  mongoose.connect(process.env.MONGO_URI);
  done();
});

/* Closing database connection after each test. */
afterAll((done) => {
  mongoose.connection.close();
  done();
});

describe("POST /register", () => {
  it("should add a new user", async () => {
    const res = await request(app).post("/register").send({
      name: "user 2",
      email: "user2@email.com",
      password: "secretpassword",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User created");
  });
});

describe("POST /login", () => {
  it("should login a user", async () => {
    const res = await request(app).post("/login").send({
      email: "user2@email.com",
      password: "secretpassword",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Login successful");
  });
});

describe("GET /logout", () => {
  it("should logout a user", async () => {
    const res = await request(app).get("/logout");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Logout successful");
  });
});
