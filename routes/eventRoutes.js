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

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: List events (filter, sort, search, paginate)
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: city
 *         schema: { type: string }
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [date, registrations] }
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc] }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Paginated list of events }
 */
router.get('/', eventController.listEvents);

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Get a single event, populated with category and organizer
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: The event }
 *       404: { description: Event not found }
 */
router.get('/:id', eventController.getEvent);

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create a new event (admin only)
 *     tags: [Events]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, category, date, city, capacity]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               category: { type: string }
 *               date: { type: string, format: date-time }
 *               city: { type: string }
 *               capacity: { type: integer }
 *     responses:
 *       201: { description: Event created }
 *       401: { description: Not logged in }
 *       403: { description: Admins only }
 *       422: { description: Validation failed }
 */
router.post(
  '/',
  requireAuth,
  requireRole('admin'),
  eventValidationRules,
  validate,
  eventController.createEvent
);

/**
 * @swagger
 * /api/events/{id}:
 *   patch:
 *     summary: Update an event (admin only)
 *     tags: [Events]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Event updated }
 *       401: { description: Not logged in }
 *       403: { description: Admins only }
 *       404: { description: Event not found }
 */
router.patch(
  '/:id',
  requireAuth,
  requireRole('admin'),
  eventUpdateValidationRules,
  validate,
  eventController.updateEvent
);

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Delete an event (admin only)
 *     tags: [Events]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Event deleted }
 *       401: { description: Not logged in }
 *       403: { description: Admins only }
 *       404: { description: Event not found }
 */
router.delete('/:id', requireAuth, requireRole('admin'), eventController.deleteEvent);

module.exports = router;
