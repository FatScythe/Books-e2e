const Book = require("../models/Book");
const User = require("../models/User");
const { isValidObjectId } = require("mongoose");
const { NotFoundError, BadRequestError } = require("../errors");
const attachCookieToResponse = require("../utils/attachCookie");
const checkPermissions = require("../utils/checkPermission");

const getAllBooks = async (req, res) => {
  /*
      This function gets all the books in the db, 
      the total number of books "count". 
      It also accepts queries for "page" number and 
      "limit" for the number of books to be returned per "page"
      NB: Default page is 1 and limit is 100
  */

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 100;
  const skip = (page - 1) * limit;

  const books = await Book.find().skip(skip).limit(limit);

  const nb = await Book.countDocuments();
  res.status(200).json({ success: true, nb, books });
};

const getSingleBook = async (req, res) => {
  /*
      This function validates the `id` sent in the params object,
      gets a single book in the db, with that unique `id`.
  */
  const { id: bookId } = req.params;

  if (!isValidObjectId(bookId)) throw new BadRequestError("Invalid book id!");

  const book = await Book.findOne({ _id: bookId });
  if (!book) throw new NotFoundError("No Book was found matching that Id");
  res.status(200).json({ success: true, book });
};

const addBook = async (req, res) => {
  /*
      This function takes 3 values.("title", "author", "price") from the request body
      validates the values, uses said value to create an instance of a Book on the db.
      And if the request user role is "user", It changes their role to "author", and 
      send a new authentication cookie to reflect the role change
  */
  const { title, author, price } = req.body;

  if (!title || !author)
    throw new BadRequestError("Please provide book title and author!");

  if (price <= 0) throw new BadRequestError("Invalid book price");

  const book = await Book.create({
    title,
    author,
    price,
    // For testing purpose change the created by your admin id
    ...(req.user
      ? { createdBy: req.user.userId }
      : { createdBy: "65e0ed811af81e2f4b700804" }),
  });

  if (req.user && req.user.role === "user") {
    const user = await User.findOne({ _id: req.user.userId });

    if (user) {
      user.role = "author";
      user.save();
      attachCookieToResponse(res, user);
    }
  }

  res.status(201).json({
    success: true,
    message: "Book Added",
    book: { _id: book._id, title, author, price },
  });
};

const updateBook = async (req, res) => {
  /*
      This function takes 3 values ("title", "author", "price") from the request body
      validates the values, validates the `id` sent in the params object, 
      find the instance of a Book with said `id` and updates it accordingly.
  */
  const { title, author, price } = req.body;
  const { id: bookId } = req.params;

  if (!isValidObjectId(bookId)) throw new BadRequestError("Invalid book id!");

  if (!title || !author)
    throw new BadRequestError("Please provide book title and author!");

  if (price <= 0) throw new BadRequestError("Invalid book price");

  const book = await Book.updateOne(
    { _id: bookId },
    { title, author, price },
    { runValidators: true }
  );

  if (book && book.modifiedCount == 0)
    throw new NotFoundError("Book no longer exist");

  res.status(200).json({
    success: true,
    message: "Book has been updated",
    book: { _id: bookId, title, author, price },
  });
};

const deleteBook = async (req, res) => {
  /*
      This function validates the id sent in the params object, 
      finds the instance of a Book with said `id` and deletes it.
      NB: The `checkPermission` fn only allow Admins and 
      User who added the instance of the book can delete it
  */
  const { id: bookId } = req.params;

  if (!isValidObjectId(bookId)) throw new BadRequestError("Invalid book id!");

  const book = await Book.findOne({ _id: bookId });

  if (!book) throw new NotFoundError("Book no longer exist");

  if (req.user) checkPermissions(req.user, book.createdBy);

  book.deleteOne();

  res.status(200).json({
    success: true,
    message: "Book has been deleted",
  });
};

module.exports = {
  getAllBooks,
  getSingleBook,
  addBook,
  updateBook,
  deleteBook,
};
