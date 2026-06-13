import { Contact } from '../models/Contact.js';

// @desc    Submit a contact message
// @route   POST /api/contact
// @access  Public
export const createContact = async (req, res, next) => {
  const { name, phone, email, subject, message } = req.body;

  try {
    const contact = await Contact.create({
      name,
      phone,
      email,
      subject,
      message,
      isRead: false,
    });

    res.status(201).json({
      success: true,
      data: contact,
      message: 'Message sent successfully! We will get back to you shortly.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact messages (Admin only)
// @route   GET /api/contact
// @access  Private/Admin
export const getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: contacts.length, data: contacts });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle contact read/unread status
// @route   PATCH /api/contact/:id/read
// @access  Private/Admin
export const markContactAsRead = async (req, res, next) => {
  const { isRead } = req.body;

  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ success: false, message: `Contact message not found with id of ${req.params.id}` });
    }

    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: isRead !== undefined ? isRead : true },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: contact });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ success: false, message: `Contact message not found with id of ${req.params.id}` });
    }

    await Contact.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
