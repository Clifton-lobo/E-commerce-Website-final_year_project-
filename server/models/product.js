const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    image: String,
    title: String,
    author: String,
    description: String,
    category: String,
    bookcondition: String,
    language: String,
    price: Number,
    totalStock: Number
}, { timestamps: true });

// Prevent overwriting the model if it already exists
module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema);