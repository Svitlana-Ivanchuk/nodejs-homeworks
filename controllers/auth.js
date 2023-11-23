const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../models/user");

const { HttpError } = require("../helpers");

const { SECRET_KEY } = process.env;

async function register(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).exec();
    if (user) {
      throw HttpError(409, "Email in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ ...req.body, password: hashPassword });
    res
      .status(201)
      .json(newUser)
      .send({ message: "Registration successfully" });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;
  console.log(req.user);
  try {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      throw HttpError(401, "Email or password is wrong");
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
    res.json({ token });
  } catch (error) {
    next(error);
  }
}

async function getCurrent(req, res, next) {
  try {
    const { email, token } = req.user;
    console.log(req.user);
    res.json({
      email,
      token,
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
    const user = await User.findByIdAndUpdate(_id, req.body).exec();
    if (!_id) {
      throw HttpError(404, "Not found");
    }
    res.json(user);
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
};
