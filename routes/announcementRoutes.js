const express = require('express');
const { body } = require('express-validator');
const announcementController = require('../controllers/announcementController');
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');
const validate = require('../middleware/validate');

const router = express.Router();

router.post(
  '/',
  requireAuth,
  requireRole('admin'),
  [
    body('eventId').isMongoId().withMessage('A valid event id is required'),
    body('text').notEmpty().withMessage('Text is required'),
  ],
  validate,
  announcementController.createAnnouncement
);

// Public - anyone can read announcement history
router.get('/:eventId', announcementController.getAnnouncements);

module.exports = router;
