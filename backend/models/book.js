// backend/models/book.js

const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    price: { type: Number, required: true }, // Price in INR
});

module.exports = mongoose.model('Book', bookSchema);
