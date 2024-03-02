const router = require("express").Router();
const { register, login, logout } = require("./controllers/AuthCtrl");
const {
  getAllBooks,
  getSingleBook,
  addBook,
  updateBook,
  deleteBook,
} = require("./controllers/BookCtrl");
const {
  authenticateUser,
  authorizePermissions,
} = require("./middlewares/authentication");

// Auth Routes
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

// Books Routes
// NB: The routes to addBook,getSingleBook, updateBook and deleteBook are all authenticated
//     The route updateBook and deleteBook can only be used by user with role admin and author
// router.route("/books").get(getAllBooks).post(authenticateUser, addBook);
// router
//   .route("/books/:id")
//   .get(authenticateUser, getSingleBook)
//   .put([authenticateUser, authorizePermissions("admin", "author")], updateBook)
//   .delete(
//     [authenticateUser, authorizePermissions("admin", "author")],
//     deleteBook
//   );

// For test only
router.route("/books").get(getAllBooks).post(addBook);
router
  .route("/books/:id")
  .get(getSingleBook)
  .put(updateBook)
  .delete(deleteBook);

module.exports = router;
