const express = require('express');
const router = express.Router();
const categoryController = require('controllers/category');

router.get('/', categoryController.showCategory);

router.get('/:slug', categoryController.showCategory);
router.get('/:parent/:slug', categoryController.showCategory);

module.exports = router;