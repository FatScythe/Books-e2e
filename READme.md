## BOOKS
>#### Assessment designed to evaluate the skills and knowledge of a backend engineer, focusing on their proficiency with Node.js.

#### Name: Abdullahi Fahm Oladayo
#### Framework ✨ - ExpressJS
#### Database ✨ - MongoDB
---

### 📚 Getting Started

#### 🛠️ Installation
1. Clone the project or download zip file
2. Navigate to the project directory
   ```bash
   cd Assesment-Books
   ```
3. Install dependencies with ``` npm install ```
4. Visit mongodb and create a database, and get a connection string
5. Use ```.env_sample``` to configure the ```.env``` 
6. Run ```npm run dev ``` to start server in dev mode and ```npm run start ``` in production
omponents - >= 10 

### API
#### NB:
1. "*" -- compulsory field
2. "?" -- optional field

## Authentication
Authentication is enabled in this app using JWT and cookies.
Token is sent with each request, that requires authentication and it's verified on the server.

1. Endpoint to register user
### Request
```JSON
POST: {{DOMAIN}}/register
{
    "name" *: "your name",
    "email" *: "youremail@something.com",
    "password" *: "yourpassword"
}
```
### Response
``` JSON
{
    "success": true,
    "message": "User created",
    "user": 
    { 
        "userId": "user's id", 
        "name": "user's name", 
        "email": "user's email", 
        "role": "admin | user | author" 
}
}
```

2. Endpoint to login user
### Request
```JSON
POST: {{DOMAIN}}/login
{
   "email" *: "your email",
   "password" *: "your password",
}
```
### Response
``` JSON
{
    "success": true,
    "message": "Login successful",
    "user": { 
        "userId": "user's id", 
        "name": "user's name", 
        "email": "user's email", 
        "role": "admin | user | author" 
    }
}
```
3. Endpoint to logout
### Request
```JSON
GET:{{DOMAIN}}/logout
    {}
```
### Response
``` JSON
{
    "success": true,
    "message": "Logout successful",
}
```

## Books
2. Endpoint to get all books
#### NB: You can also send a query to get a page and limit the number of book displayed per page, by default it will request page 1 and limit the number of books displayed to 100 
### Request
```JSON
GET: {{DOMAIN}}/books?page=1&limit=1
{}
```
### Response
``` JSON
{
    "success": true,
    "nb": "number of books",
    "books": "Array of object of books"
}
```

2. Endpoint to get a single book (Authenticated)
### Request
```JSON
GET: {{DOMAIN}}/books/:id
{}
```
### Response
``` JSON
{
    "success": true,
    "book": "A book",
}
```
3. Endpoint to add a book (Authenticated)
#### NB: Adding a book change an authenticated user with the role of "user" to a role of "author"
### Request
```JSON
POST:{{DOMAIN}}/books
    { 
        "title": "Book Title", 
        "author": "Book Author", 
        "price": 2000
    }
```
### Response
``` JSON
{
    "success": true,
    "message": "Book Added",
    "book": { 
        "_id": "book added id", 
        "title": "Book Title", 
        "author": "Book Author", 
        "price": 2000 
    },
}
```

4. Endpoint to update a book (Authenticated, Authorize for admin and authors only)
### Request
```JSON
PUT:{{DOMAIN}}/books/:id
    { 
        "title": "Book Title", 
        "author": "Book Author", 
        "price": 2000
    }
```
### Response
``` JSON
{
    "success": true,
    "message": "Book Added",
    "book": { 
        "_id": "book has been updated", 
        "title": "Book Title", 
        "author": "Book Author", 
        "price": 2000 
    },
}
```

5. Endpoint to delete a book (Authenticated, Authorize for admin and authors)
#### NB: Only admin and author who added the book can delete a book
### Request
```JSON
DELETE:{{DOMAIN}}/books/:id
    {}
```
### Response
``` JSON
{
    "success": true,
    "message": "Book has been deleted",
}
```

## Error Handling
Error is handled using the express-async-error library, it catches all error in the controllers and middleware and forward them to the error-handler-middleware

```JS
const errorHandlerMiddleware = async (err, req, res, next) => {
  /*
    Middleware: Catches all the unexpected errors 
    forward by the library "express-async-error", and 
    handles them by sending a concise response
   */

  let customErr = {
    statusCode: err.statusCode || 500,
    message:
      err.message ||
      "Something went wrong, our engineers are currently working on it",
  };

  // Catches all Database Validation Error
  if (err.name === "ValidationError") {
    customErr.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    customErr.statusCode = 400;
  }

  // Catches all Database Unique Constraint Error
  if (err.code && err.code === 11000) {
    customErr.message = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field(s), Please choose another value`;
    customErr.statusCode = 400;
  }

  if (err.name === "CastError") {
    customErr.message = `No item found with id : ${err.value}`;
    customErr.statusCode = 404;
  }

  res
    .status(customErr.statusCode)
    .json({ success: false, message: customErr.message });
};
```

## Testing
Testing is done with `jest`, `super-test` and `cross-env`
Run `npm run test` to test

``` JS
describe("GET /books", () => {
  it("should return all books", async () => {
    const res = await request(app).get("/books");
    expect(res.statusCode).toBe(200);
    expect(res.body.books.length).toBeGreaterThan(0);
  });
});
```