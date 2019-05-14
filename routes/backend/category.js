const express = require('express');
const router = express.Router();
const categoryController = require('controllers/backend/category');

router.get('/', categoryController.indexView);

router.get('/create', categoryController.createView);
router.post('/create', categoryController.createAction);

router.get('/edit/:id', categoryController.editView);
router.post('/edit/:id', categoryController.editAction);

router.post('/:id', categoryController.deleteAction);

router.post('/slug', categoryController.getSlug);
router.post('/remove', categoryController.canDelete);

module.exports = router;