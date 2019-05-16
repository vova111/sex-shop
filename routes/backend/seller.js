const express = require('express');
const router = express.Router();
const multer  = require('multer');
const upload = multer();
const sellerController = require('controllers/backend/seller');

router.get('/', sellerController.indexView);

router.get('/create', sellerController.createView);
router.post('/create', upload.none(), sellerController.createAction);

router.get('/edit/:id', sellerController.editView);
router.post('/edit/:id', upload.none(), sellerController.editAction);

router.post('/:id', sellerController.deleteAction);

router.post('/slug', sellerController.getSlug);
router.post('/remove', sellerController.canDelete);

module.exports = router;