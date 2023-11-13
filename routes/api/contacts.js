const express = require("express");
const Joi = require("joi");

const ContactController = require("../../controllers/contact");

const contacts = require("../../models/contacts");

const router = express.Router();

const addSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().required(),
  phone: Joi.string()
    .pattern(/^\(\d{3}\)\s\d{3}-\d{4}/)
    .required(),
});

router.get("/", ContactController.getContacts);

router.get("/:contactId", ContactController.getContactById);

router.post("/", ContactController.createContact);

router.put("/:contactId", ContactController.updateContact);

router.delete("/:contactId", ContactController.removeContact);

module.exports = router;
