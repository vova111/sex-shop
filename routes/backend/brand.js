const express = require('express');
const router = express.Router();
const brandController = require('controllers/backend/brand');

router.get('/', brandController.indexView);

router.get('/create', brandController.createView);
router.post('/create', brandController.createAction);

router.get('/edit/:id', brandController.editView);
router.post('/edit/:id', brandController.editAction);

router.post('/:id', brandController.deleteAction);

module.exports = router;