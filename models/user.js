const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../middlewares");

const subscriptList = ["starter", "pro", "business"];

const userSchema = new Schema(
  {
    password: {
      type: String,
      minlength: 6,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],

      unique: true,
    },
    subscription: {
      type: String,
      enum: subscriptList,
      default: "starter",
    },
    //token: String,
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().required(),
  subscription: Joi.string()
    .valid(...subscriptList)
    .required(),
  //token: Joi.string().required(),
});

const loginSchema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().required(),
  subscription: Joi.string()
    .valid(...subscriptList)
    .required(),
  //token: Joi.string().required(),
});

const schemas = {
  registerSchema,
  loginSchema,
};

const User = model("User", userSchema);

module.exports = { User, schemas };
