const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("node:fs/promises");
const gravatar = require("gravatar");
const path = require("node:path");
const Jimp = require("jimp");
const { nanoid } = require("nanoid");

const { User } = require("../models/user");
const { HttpError, sendEmail } = require("../helpers");

const { SECRET_KEY, BASE_URL } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

async function register(req, res, next) {
 const { email, password } = req.body;

 try {
  const user = await User.findOne({ email }).exec();
  if (user) {
   throw HttpError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();

  const newUser = await User.create({
   ...req.body,
   password: hashPassword,
   avatarURL,
   verificationToken,
  });
  const { subscription } = newUser;

  const verifyEmail = {
   to: email,
   subject: "Verify email",
   html: `<a target="-blank" href="${BASE_URL}/users/verify/${verificationToken}">Click verify your email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({ user: { email, subscription } });
 } catch (error) {
  next(error);
 }
}

async function verifyEmail(req, res, next) {
 const { verificationToken } = req.params;

 try {
  const user = await User.findOne({ verificationToken });

  if (!user) {
   throw HttpError(404, "User not found");
  }
  await User.findByIdAndUpdate(user._id, {
   verify: true,
   verificationToken: "",
  });

  res.status(200).json({
   message: "Verification successful",
  });
 } catch (error) {
  next(error);
 }
}

async function resendVerifyEmail(req, res, next) {
 const { email } = req.body;
 try {
  const user = await User.findOne({ email });

  if (!user) {
   throw HttpError(401, "User not found");
  }
  if (user.verify === true) {
   throw HttpError(404, "Verification has already been passed");
  }
  console.log(user);
  const verifyEmail = {
   to: email,
   subject: "Verify email",
   html: `<a target="-blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click verify your email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({ email, message: "Verification email sent" });
 } catch (error) {
  next(error);
 }
}

async function login(req, res, next) {
 const { email, password } = req.body;

 try {
  const user = await User.findOne({ email }).exec();
  if (!user) {
   throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
   throw HttpError(401, "Your email address is not verified");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
   throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
   id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });
  const { subscription } = user;
  res.json({ token, user: { email, subscription } });
 } catch (error) {
  next(error);
 }
}

async function getCurrent(req, res, next) {
 try {
  const { email, subscription } = req.user;
  console.log(req.user);
  res.json({
   email,
   subscription,
  });
 } catch (error) {
  next(error);
 }
}

async function logout(req, res, next) {
 try {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).end();
 } catch (error) {
  next(error);
 }
}

async function updateSubscription(req, res, next) {
 try {
  const { _id } = req.user;
  const user = await User.findByIdAndUpdate(_id, req.body, {
   new: true,
  }).exec();
  if (!_id) {
   throw HttpError(404, "Not found");
  }
  const { email, subscription } = user;
  res.status(200).json({ email, subscription });
 } catch (error) {
  next(error);
 }
}

async function updateAvatar(req, res, next) {
 try {
  const { _id } = req.user;
  const { path: tempUpload, filename } = req.file;
  const resultUpload = path.join(avatarsDir, filename);

  const avatarResize = await Jimp.read(tempUpload);
  await avatarResize
   .contain(250, 250, Jimp.HORIZONTAL_ALIGN_LEFT | Jimp.VERTICAL_ALIGN_TOP)
   .writeAsync(tempUpload);

  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", filename);

  await User.findByIdAndUpdate(_id, { avatarURL });
  res.status(200).json({ avatarURL });
 } catch (error) {
  next(error);
 }
}

async function getAvatar(req, res, next) {
 try {
  const user = await User.findById(req.user.id).exec();

  if (!user) {
   return res.status(404).send({ message: "User not found" });
  }

  if (user.avatarURL === "") {
   return res.status(404).send({ message: "Avatar not found" });
  }

  res.sendFile(path.join(__dirname, "../", "public", user.avatarURL));
 } catch (error) {
  next(error);
 }
}

module.exports = {
 register,
 login,
 getCurrent,
 logout,
 updateSubscription,
 updateAvatar,
 getAvatar,
 verifyEmail,
 resendVerifyEmail,
};
