const mongoose = require('mongoose');
const Event = require('../models/Event');
require('../models/Category'); // registers the Category schema so populate('category') works
require('../models/User'); // registers the User schema so populate('organizer') works
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.listEvents = asyncHandler(async (req, res, next) => {
  const {
    category,
    city,
    startDate,
    endDate,
    search,
    sortBy,
    order,
    page = 1,
    limit = 10,
  } = req.query;

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

  const allowedSortFields = ['date', 'registrations'];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'date';
  const sortDirection = order === 'desc' ? -1 : 1;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  let events;
  let total;

  if (sortField === 'registrations') {
    // registrationsCount isn't stored on Event, so it's computed live via aggregation
    const pipeline = [
      { $match: filter },
      {
        $lookup: {
          from: 'registrations',
          localField: '_id',
          foreignField: 'event',
          as: 'registrations',
        },
      },
      { $addFields: { registrationsCount: { $size: '$registrations' } } },
      { $project: { registrations: 0 } },
      { $sort: { registrationsCount: sortDirection } },
      { $skip: skip },
      { $limit: limitNum },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' },
      {
        $lookup: {
          from: 'users',
          localField: 'organizer',
          foreignField: '_id',
          as: 'organizer',
        },
      },
      { $unwind: '$organizer' },
    ];

    [events, total] = await Promise.all([
      Event.aggregate(pipeline),
      Event.countDocuments(filter),
    ]);
  } else {
    [events, total] = await Promise.all([
      Event.find(filter)
        .populate('category')
        .populate('organizer', 'name email')
        .sort({ date: sortDirection })
        .skip(skip)
        .limit(limitNum),
      Event.countDocuments(filter),
    ]);
  }

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
  const event = await Event.findById(req.params.id)
    .populate('category')
    .populate('organizer', 'name email');
  if (!event) return next(new AppError('Event not found', 404));

  res.status(200).json({ status: 'success', data: event });
});

exports.createEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.create({ ...req.body, organizer: req.user.userId });
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
