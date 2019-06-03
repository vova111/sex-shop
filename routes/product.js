const express = require('express');
const router = express.Router();
const productController = require('controllers/product');

router.get('/:slug', productController.showProduct);

module.exports = router;