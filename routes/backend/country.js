const express = require('express');
const router = express.Router();
const countryController = require('controllers/backend/country');

router.get('/', countryController.indexView);

router.get('/create', countryController.createView);
router.post('/create', countryController.createAction);

router.get('/edit/:id', countryController.editView);
router.post('/edit/:id', countryController.editAction);

module.exports = router;