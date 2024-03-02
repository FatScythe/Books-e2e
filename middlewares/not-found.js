const notFound = async (req, res) =>
  res
    .status(404)
    .json({ success: false, message: "This routes does not exist" });

module.exports = notFound;
