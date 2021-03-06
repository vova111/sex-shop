const express = require('express');
const router = express.Router();
const multer  = require('multer');
const upload = multer();
const productController = require('controllers/backend/product');

router.get('/', productController.indexView);

router.get('/create', productController.createView);
router.post('/create', upload.none(), productController.createAction);

router.get('/edit/:id', productController.editView);
router.post('/edit/:id', upload.none(), productController.editAction);

router.post('/:id', productController.deleteAction);

router.post('/slug', productController.getSlug);
router.post('/prevalidation', productController.prevalidation);
router.post('/remove', productController.canDelete);

router.post('/image/main', productController.setMainImage);
router.post('/image/remove', productController.removeImage);

module.exports = router;