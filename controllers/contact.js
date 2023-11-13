const { HttpError } = require("../helpers");

function getContacts(req, res, next) {
  res.send("Get contacts");
}

//async (_, res, next) => {
//  try {
//    const result = await contacts.listContacts();
//    console.table(result);
//    res.status(200).json(result);
//  } catch (error) {
//    next(error);
//  }
//}

function getContactById(req, res, next) {
  const { contactId } = req.params;
  res.send("Get contacts");
}
//router.get("/:contactId", async (req, res, next) => {
//  try {
//    const { contactId } = req.params;
//    const contact = await contacts.getContactById(contactId);
//    if (!contact) {
//      throw HttpError(404, "Not found");
//    }
//    res.status(200).json(contact);
//  } catch (error) {
//    next(error);
//  }
//});

function createContact(req, res, next) {}

//router.post("/", async (req, res, next) => {
//  try {
//    const { error } = addSchema.validate(req.body);
//    if (error) {
//      throw HttpError(400, error.message);
//    }
//    const newContact = await contacts.addContact(req.body);
//    res.status(201).json(newContact);
//  } catch (error) {
//    next(error);
//  }
//});

function updateContact(req, res, next) {
  const { contactId } = req.params;
}

//router.put("/:contactId", async (req, res, next) => {
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
//});

function removeContact(req, res, next) {}

//router.delete("/:contactId", async (req, res, next) => {
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
//});

module.exports = {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  removeContact,
};
