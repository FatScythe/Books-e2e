const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");

require("dotenv").config();

// /* Connecting to the database before each test. */
// beforeEach((done) => {
//   mongoose.connect(process.env.MONGO_URI);
//   console.log("Connected to DB");
//   done();
// });

// /* Closing database connection after each test. */
// afterEach((done) => {
//   mongoose.connection.close();
//   done();
// });

/* Connecting to the database before all test. */
beforeAll((done) => {
  mongoose.connect(process.env.MONGO_URI);
  done();
});

/* Closing database connection after all test. */
afterAll((done) => {
  mongoose.connection.close();
  done();
});

const bookId = "65e0ee72342d746c2afcc0e2";

describe("GET /books", () => {
  it("should return all books", async () => {
    const res = await request(app).get("/books");
    expect(res.statusCode).toBe(200);
    expect(res.body.books.length).toBeGreaterThan(0);
  });
});

describe("GET /books/:id", () => {
  it("should return a book", async () => {
    const res = await request(app).get("/books/" + bookId);
    expect(res.statusCode).toBe(200);
    expect(res.body.book.title).toBe("Book Title");
  });
});

describe("POST /books", () => {
  it("should add a book", async () => {
    const res = await request(app)
      .post("/books")
      .send({
        title: "Book Title Test",
        author: "Book Author",
        price: 1000,
      })
      .set("Content-Type", "application/json");
    expect(res.statusCode).toBe(201);
    expect(res.body.book.title).toBe("Book Title Test");
  });
});

describe("PUT /books/:id", () => {
  it("should update a product", async () => {
    const res = await request(app)
      .put("/books/" + bookId)
      .send({
        title: "Book Title",
        author: "Book Author",
        price: 2000,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.book.price).toBe(2000);
  });
});

describe("DELETE /books/:id", () => {
  it("should delete a product", async () => {
    const res = await request(app).delete("/books/" + bookId);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Book has been deleted");
  });
});
