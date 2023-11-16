const express = require("express");

const ContactController = require("../../controllers/contact");
const { isValidId, validateBody } = require("../../middlewares");
const { schemas } = require("../../models/contact");

const router = express.Router();

router.get("/", ContactController.getContacts);

router.get("/:contactId", isValidId, ContactController.getContactById);

router.post(
  "/",
  validateBody(schemas.addSchema),
  ContactController.createContact
);

router.put(
  "/:contactId",
  isValidId,
  validateBody(schemas.addSchema),
  ContactController.updateContact
);

router.delete("/:contactId", isValidId, ContactController.removeContact);

router.patch(
  "/:contactId/favorite",
  isValidId,
  validateBody(schemas.updateFavoriteSchema),
  ContactController.updateStatusContact
);

module.exports = router;
