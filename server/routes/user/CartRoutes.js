const express =  require('express');

const {addToCart,fetchCartItems,updateCartItem,deleteCartItem} =require('../../controllers/User/CartController');


const router = express.Router();

router.post('/add', addToCart)
router.get('/get/:userId', fetchCartItems)
router.put('/update-cart', updateCartItem)
router.delete('/:userId/:productId', deleteCartItem)



module.exports = router;