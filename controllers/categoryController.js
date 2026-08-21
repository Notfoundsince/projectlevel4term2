const Category = require('../models/Category');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.listCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().sort({ name: 1 });

  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: categories,
  });
});

exports.createCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  const existing = await Category.findOne({ name });
  if (existing) {
    return next(new AppError('Category already exists', 400));
  }

  const category = await Category.create({ name });

  res.status(201).json({ status: 'success', data: category });
});
