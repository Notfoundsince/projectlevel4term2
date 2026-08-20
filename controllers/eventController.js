const Event = require('../models/Event');
require('../models/Category'); // registers the Category schema so populate('category') works
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.listEvents = asyncHandler(async (req, res, next) => {
  const { category, city, startDate, endDate, search, sortBy, page = 1, limit = 10 } = req.query;

  const filter = {};

  if (category) filter.category = category;
  if (city) filter.city = city;

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  let sort = {};
  if (sortBy === 'date') sort = { date: 1 };
  if (sortBy === 'registrations') sort = { registrationsCount: -1 };

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const [events, total] = await Promise.all([
    Event.find(filter).populate('category').sort(sort).skip(skip).limit(limitNum),
    Event.countDocuments(filter),
  ]);

  res.status(200).json({
    status: 'success',
    data: events,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
  });
});

exports.getEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id).populate('category');
  if (!event) return next(new AppError('Event not found', 404));

  res.status(200).json({ status: 'success', data: event });
});

exports.createEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.create(req.body);
  res.status(201).json({ status: 'success', data: event });
});

exports.updateEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!event) return next(new AppError('Event not found', 404));

  res.status(200).json({ status: 'success', data: event });
});

exports.deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) return next(new AppError('Event not found', 404));

  res.status(200).json({ status: 'success', message: 'Event deleted' });
});
