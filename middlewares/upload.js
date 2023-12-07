const multer = require("multer");
const path = require("node:path");

const crypto = require("node:crypto");

const tempDir = path.join(__dirname, "../", "temp");

const storage = multer.diskStorage({
 destination: (req, file, cb) => {
  cb(null, tempDir);
 },
 filename: (req, file, cb) => {
  const extname = path.extname(file.originalname);
  const basename = path.basename(file.originalname, extname);
  const suffix = crypto.randomUUID();
  cb(null, `${basename}-${suffix}${extname}`);
 },
});

const upload = multer({ storage });

module.exports = upload;
