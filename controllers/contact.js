const { Contact } = require("../models/contact");

const { HttpError } = require("../helpers");

async function getContacts(req, res, next) {
  try {
    const { _id: owner } = req.user;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const result = await Contact.find({ owner }, "-createdAt -updatedAt", {
      skip,
      limit,
    }).populate("owner", "name email");
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function getContactById(req, res, next) {
  const { contactId } = req.params;

  try {
    const { _id: owner } = req.user;
    const contact = await Contact.findById(contactId).exec();
    if (!contact) {
      throw HttpError(404, "Not found");
    }
    if (contact.owner !== owner) {
      throw HttpError(404, "Not found");
    }

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
}

async function createContact(req, res, next) {
  try {
    const { _id: owner } = req.user;
    const newContact = await Contact.create({ ...req.body, owner });
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
}

async function updateContact(req, res, next) {
  try {
    const { contactId } = req.params;
    const contactById = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });
    if (!contactById) {
      throw HttpError(404, "Not found");
    }
    res.json(contactById);
  } catch (error) {
    next(error);
  }
}

async function updateStatusContact(req, res, next) {
  try {
    const { contactId } = req.params;
    const contactById = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });
    if (!contactById) {
      throw HttpError(404, "Not found");
    }
    res.json(contactById);
  } catch (error) {
    next(error);
  }
}

async function removeContact(req, res, next) {
  try {
    const { contactId } = req.params;
    const contact = await Contact.findByIdAndDelete(contactId);
    if (!contact) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json({
      message: "Contact deleted",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  removeContact,
  updateStatusContact,
};
