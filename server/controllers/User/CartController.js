const Cart = require('../../models/Cart');
const Product = require('../../models/product');


// Add item to cart
const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        // Validate input
        if (!userId || !productId || quantity <= 0) {
            return res.status(400).json({
                 success: false,
                  message: 'Invalid data provided' });
        }   

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                 success: false,
                  message: 'Product not found' });
        }

        let cart = await Cart.findOne({ userId });

        // If cart doesn't exist, create a new one
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const findCurrentProductIndex = cart.items.findIndex(item =>
            item.productId.toString() === productId
        );

        if (findCurrentProductIndex === -1) {
            cart.items.push({ productId, quantity });
        } else {
            cart.items[findCurrentProductIndex].quantity += quantity;
        }

        await cart.save();

        return res.status(200).json({
             success: true, data: cart });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


// Fetch cart items
const fetchCartItems = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ 
                success: false,
                 message: 'User ID is mandatory' });
        }

        const cart = await Cart.findOne({ userId }).populate({
            path: 'items.productId',
            select: 'image title price author bookcondition',
        });

        if (!cart) {
            return res.status(404).json({ 
                success: false, 
                message: 'Cart not found' });
        }

        // Remove any invalid items (products that were deleted)
        const validItems = cart.items.filter(productItem => productItem.productId);

        if (validItems.length < cart.items.length) {
            cart.items = validItems;
            await cart.save();
        }

        // Map items for response
        const populatedCartItems = validItems.map(item => ({
            productId: item.productId._id,
            image: item.productId.image,
            title: item.productId.title,
            price: item.productId.price,
            author: item.productId.author,
            bookcondition: item.productId.bookcondition,
            quantity: item.quantity,
        }));

        return res.status(200).json({
            success: true,
            data: { 
                ...cart._doc,
                 items: populatedCartItems },
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


// Update cart item quantity
const updateCartItem = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        if (!userId || !productId || quantity <= 0) {
            return res.status(400).json({ success: false, 
                message: 'Invalid data provided' });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        const findCurrentProductIndex = cart.items.findIndex(item =>
            item.productId.toString() === productId
        );

        if (findCurrentProductIndex === -1) {
            return res.status(404).json({
                 success: false, 
                 message: 'Cart item not present' });
        }

        cart.items[findCurrentProductIndex].quantity = quantity;
        await cart.save();

        await cart.populate({
             path: 'items.productId',
              select: 'image title price author bookcondition' });

        const populatedCartItems = cart.items.map((item) => ({
            productId: item.productId ? item.productId._id : null,
            image: item.productId ? item.productId.image : null,
            title: item.productId ? item.productId.title : null,
            price: item.productId ? item.productId.price : null,
            author: item.productId ? item.productId.author : null,
            bookcondition: item.productId ? item.productId.bookcondition : null,
            quantity: item.quantity,
        }));

        return res.status(200).json({
            success: true,
            data: { ...cart._doc,
                 items: populatedCartItems },
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


// Delete item from cart
const deleteCartItem = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        if (!userId || !productId) {
            return res.status(400).json({
                 success: false,
                   message: 'Invalid data provided' });
        }

        const cart = await Cart.findOne({ userId }).populate({
            path: 'items.productId',
            select: 'image title price author bookcondition',
        });

        if (!cart) {
            return res.status(404).json({ 
                success: false,
                 message: 'Cart not found' });
        }

        // Remove the specific product from cart
        cart.items = cart.items.filter(item =>  item.productId._id.toString() !== productId);
        await cart.save();

        await cart.populate({ 
            path: 'items.productId',
              select: 'image title price author bookcondition' });

        const populatedCartItems = cart.items.map(item => ({
            productId: item.productId ? item.productId._id : null,
            image: item.productId ? item.productId.image : null,
            title: item.productId ? item.productId.title : null,
            price: item.productId ? item.productId.price : null,
            author: item.productId ? item.productId.author : null,
            bookcondition: item.productId ? item.productId.bookcondition : null,
            quantity: item.quantity,
        }));

        return res.status(200).json({
            success: true,
            data: { ...cart._doc, items: populatedCartItems },
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = { addToCart, fetchCartItems, updateCartItem, deleteCartItem };
