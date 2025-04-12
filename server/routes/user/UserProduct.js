const express =  require('express');

const {getFilteredProducts,getProductDetail} =require('../../controllers/User/UserProductController');


const router = express.Router();

router.get('/get', getFilteredProducts)
router.get('/get/:id', getProductDetail)



module.exports = router;