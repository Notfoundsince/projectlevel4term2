const express = require('express');
const { body } = require('express-validator');
const eventController = require('../controllers/eventController');
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');
const validate = require('../middleware/validate');

const router = express.Router();

const eventValidationRules = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').isMongoId().withMessage('A valid category id is required'),
  body('date').isISO8601().withMessage('A valid date is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be a positive integer'),
];

const eventUpdateValidationRules = [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('category').optional().isMongoId().withMessage('A valid category id is required'),
  body('date').optional().isISO8601().withMessage('A valid date is required'),
  body('city').optional().notEmpty().withMessage('City cannot be empty'),
  body('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be a positive integer'),
];

router.get('/', eventController.listEvents);
router.get('/:id', eventController.getEvent);

router.post(
  '/',
  requireAuth,
  requireRole('admin'),
  eventValidationRules,
  validate,
  eventController.createEvent
);

router.patch(
  '/:id',
  requireAuth,
  requireRole('admin'),
  eventUpdateValidationRules,
  validate,
  eventController.updateEvent
);

router.delete('/:id', requireAuth, requireRole('admin'), eventController.deleteEvent);

module.exports = router;
