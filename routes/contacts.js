const express = require("express");

const ContactController = require("../controllers/contact");
const { isValidId, validateBody, authenticate } = require("../middlewares");
const { schemas } = require("../models/contact");

const router = express.Router();

router.get("/", authenticate, ContactController.getContacts);

router.get(
  "/:contactId",
  authenticate,
  isValidId,
  ContactController.getContactById
);

router.post(
  "/",
  authenticate,
  validateBody(schemas.addSchema),
  ContactController.createContact
);

router.put(
  "/:contactId",
  authenticate,
  isValidId,
  validateBody(schemas.addSchema),
  ContactController.updateContact
);

router.delete(
  "/:contactId",
  authenticate,
  isValidId,
  ContactController.removeContact
);

router.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  validateBody(schemas.updateFavoriteSchema),
  ContactController.updateStatusContact
);

module.exports = router;
