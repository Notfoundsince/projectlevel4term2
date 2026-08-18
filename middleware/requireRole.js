const AppError = require('../utils/AppError');

module.exports = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return next(new AppError('You do not have permission to perform this action', 403));
  }
  next();
};
