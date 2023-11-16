const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../middlewares");
const phoneRegexp = /^\(\d{3}\)\s\d{3}-\d{4}/;

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      match: phoneRegexp,
      required: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);
// виправлення статусу помилки на 400
contactSchema.post("save", handleMongooseError);

const addSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().required(),
  phone: Joi.string().pattern(phoneRegexp).required(),
  favorite: Joi.boolean(),
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const schemas = {
  addSchema,
  updateFavoriteSchema,
};

const Contact = model("Contact", contactSchema);

module.exports = { Contact, schemas };
