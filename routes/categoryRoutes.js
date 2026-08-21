const express = require('express');
const { body } = require('express-validator');
const categoryController = require('../controllers/categoryController');
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/', categoryController.listCategories);

router.post(
  '/',
  requireAuth,
  requireRole('admin'),
  [body('name').notEmpty().withMessage('Category name is required')],
  validate,
  categoryController.createCategory
);

module.exports = router;
