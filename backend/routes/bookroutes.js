const express = require('express');
const router = express.Router();
const Book = require('../models/book'); // Import the model we just made

// 1. GET ALL BOOKS (For Home Page)
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 2. ADD A BOOK (For Admin Page)
router.post('/add', async (req, res) => {
    const { title, author, price, image, description } = req.body;

    try {
        const newBook = new Book({ title, author, price, image, description });
        await newBook.save();
        res.status(201).json(newBook);
        console.log("✅ Book Added:", title);
    } catch (error) {
        console.error("❌ Error adding book:", error);
        res.status(400).json({ message: "Error saving book" });
    }
});

module.exports = router;