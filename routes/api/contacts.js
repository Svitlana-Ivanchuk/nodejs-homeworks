const express = require("express");

const ContactController = require("../../controllers/contact");

const router = express.Router();

router.get("/", ContactController.getContacts);

router.get("/:contactId", ContactController.getContactById);

router.post("/", ContactController.createContact);

router.put("/:contactId", ContactController.updateContact);

router.delete("/:contactId", ContactController.removeContact);

module.exports = router;
