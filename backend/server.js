// backend/server.js  -- CORRECTED VERSION

const express = require('express');
const dotenv = require('dotenv');
dotenv.config(); 

const mongoose = require('mongoose');
const cors = require('cors'); // We will configure this line
const paymentRoutes = require('./routes/payment');
const Book = require('./models/book');


const app = express();

// Middleware
// V V V THIS IS THE FIX V V V
app.use(cors());
// ^ ^ ^ THIS IS THE FIX ^ ^ ^

app.use(express.json());

// DB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));


// A simple route to get books data
app.get('/api/books', async (req, res) => {
    try {
        let books = await Book.find();
        if (books.length === 0) {
            const seedBooks = [
                { title: 'The Silent Patient', author: 'Alex Michaelides', price: 350 },
                { title: 'Atomic Habits', author: 'James Clear', price: 550 },
                { title: 'Ikigai', author: 'Héctor García', price: 420 },
            ];
            books = await Book.insertMany(seedBooks);
        }
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books' });
    }
});


// Payment Route
app.use('/api/payment', paymentRoutes);


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});