const { Contact, schemas } = require("../models/contact");

const { HttpError } = require("../helpers");

async function getContacts(req, res, next) {
  try {
    const result = await Contact.find().exec();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function getContactById(req, res, next) {
  const { contactId } = req.params;

  try {
    const contact = await Contact.findById(contactId).exec();
    if (!contact) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
}

async function createContact(req, res, next) {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const newContact = await Contact.create(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
}

function updateContact(req, res, next) {
  const { contactId } = req.params;
}

// router.put("/:contactId", async (req, res, next) => {
//  try {
//    const { error } = addSchema.validate(req.body);
//    if (error) {
//      throw HttpError(400, error.message);
//    }
//    const { contactId } = req.params;
//    const contactById = await contacts.updateContact(contactId, req.body);
//    if (!contactById) {
//      throw HttpError(404, "Not found");
//    }
//    res.json(contactById);
//  } catch (error) {
//    next(error);
//  }
// });

function removeContact(req, res, next) {}

// router.delete("/:contactId", async (req, res, next) => {
//  try {
//    const { contactId } = req.params;
//    const contact = await contacts.removeContact(contactId);
//    if (!contact) {
//      throw HttpError(404, "Not found");
//    }
//    res.status(200).json({
//      message: "Contact deleted",
//    });
//  } catch (error) {
//    next(error);
//  }
// });

module.exports = {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  removeContact,
};
