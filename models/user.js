const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

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
  token: {
   type: String,
   default: "",
  },
  avatarURL: {
   type: String,
   default: "",
  },
  verify: {
   type: Boolean,
   default: false,
  },
  verificationToken: {
   type: String,
   required: [true, "Verify token is required"],
  },
 },
 { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
 password: Joi.string()
  .min(6)
  .required()
  .error(new Error("Missing required field password")),
 email: Joi.string()
  .required()
  .error(new Error("Missing required field email")),
});

const emailSchema = Joi.object({
 email: Joi.string()
  .required()
  .error(new Error("Missing required field email")),
});

const loginSchema = Joi.object({
 email: Joi.string()
  .required()
  .error(new Error("Missing required field email")),
 password: Joi.string()
  .min(6)
  .required()
  .error(new Error("Missing required field password")),
});

const updateSubscriptionSchema = Joi.object({
 subscription: Joi.string()
  .valid(...subscriptList)
  .required(),
});

const updateAvatar = Joi.object({
 avatarURL: Joi.string().required().error(new Error("Nothing to update")),
});

const schemas = {
 registerSchema,
 emailSchema,
 loginSchema,
 updateSubscriptionSchema,
 updateAvatar,
};

const User = model("user", userSchema);

module.exports = {
 User,
 schemas,
};
