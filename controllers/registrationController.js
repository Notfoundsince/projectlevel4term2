const Registration = require('../models/Registration');
const Event = require('../models/Event');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.createRegistration = asyncHandler(async (req, res, next) => {
  const { eventId } = req.body;

  const event = await Event.findById(eventId);
  if (!event) return next(new AppError('Event not found', 404));

  if (event.registrationsCount >= event.capacity) {
    return next(new AppError('Event has reached full capacity', 400));
  }

  const existing = await Registration.findOne({ user: req.user.id, event: eventId });
  if (existing) {
    return next(new AppError('You are already registered for this event', 400));
  }

  const registration = await Registration.create({ user: req.user.id, event: eventId });

  event.registrationsCount += 1;
  await event.save();

  res.status(201).json({ status: 'success', data: registration });
});

exports.myRegistrations = asyncHandler(async (req, res, next) => {
  const registrations = await Registration.find({ user: req.user.id }).populate('event');

  res.status(200).json({
    status: 'success',
    results: registrations.length,
    data: registrations,
  });
});

exports.cancelRegistration = asyncHandler(async (req, res, next) => {
  const registration = await Registration.findById(req.params.id);
  if (!registration) return next(new AppError('Registration not found', 404));

  if (registration.user.toString() !== req.user.id) {
    return next(new AppError('You are not authorized to cancel this registration', 403));
  }

  await registration.deleteOne();

  const event = await Event.findById(registration.event);
  if (event && event.registrationsCount > 0) {
    event.registrationsCount -= 1;
    await event.save();
  }

  res.status(200).json({ status: 'success', message: 'Registration cancelled' });
});
