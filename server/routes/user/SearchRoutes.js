const express = require('express');
const { searchProducts } = require('../../controllers/User/SearchController');

const router = express.Router();

router.get('/:keyword',searchProducts);

module.exports = router;