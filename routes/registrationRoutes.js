const express = require('express');
const { body } = require('express-validator');
const registrationController = require('../controllers/registrationController');
const requireAuth = require('../middleware/requireAuth');
const validate = require('../middleware/validate');

const router = express.Router();

router.post(
  '/',
  requireAuth,
  [body('eventId').isMongoId().withMessage('A valid event id is required')],
  validate,
  registrationController.createRegistration
);

router.get('/my', requireAuth, registrationController.myRegistrations);

router.delete('/:id', requireAuth, registrationController.cancelRegistration);

module.exports = router;
