const Event = require('../models/Event');
const Message = require('../models/Message');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.createAnnouncement = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  if (!event) return next(new AppError('Event not found', 404));

  const message = await Message.create({
    event: event._id,
    sender: req.user.id,
    content: req.body.content,
  });

  const io = req.app.get('io');
  if (io) {
    io.to(`event:${event._id}`).emit('announcement', {
      event: event._id,
      sender: req.user.id,
      content: message.content,
      timestamp: message.createdAt,
    });
  }

  res.status(201).json({ status: 'success', data: message });
});

exports.getAnnouncements = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  if (!event) return next(new AppError('Event not found', 404));

  const messages = await Message.find({ event: event._id })
    .populate('sender', 'name email')
    .sort({ createdAt: 1 });

  res.status(200).json({
    status: 'success',
    results: messages.length,
    data: messages,
  });
});
