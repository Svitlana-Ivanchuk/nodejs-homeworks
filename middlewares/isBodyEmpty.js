const { HttpError } = require("../helpers");

const isBodyEmpty = (req, res, next) => {
 console.log(req.body);

 if (!req.file && req.method === "PATCH") {
  return next(
   HttpError(400, "Nothing to update, attach a file with an avatar")
  );
 } else if (
  JSON.stringify(req.body) === JSON.stringify({}) &&
  req.method === "PUT"
 ) {
  return next(HttpError(400, "Nothing to update, write your changes"));
 }

 next();
};

module.exports = isBodyEmpty;
