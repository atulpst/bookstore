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


// backend/server.js
// ... (keep all the code above this)

// A simple route to get books data
app.get('/api/books', async (req, res) => {
    try {
        // We will clear the old books and add the new ones
        await Book.deleteMany({}); // Optional: Clears old data

        const seedBooks = [
            { 
                title: 'Guyton and Hall Textbook of Medical Physiology', 
                author: 'Guyton & Hall', 
                price: 1500,
                coverImage: 'https://i.ibb.co/Xkpj7tZN/Screenshot-2025-11-01-at-11-18-00-AM.png' // Find and paste a real image URL here
            },
            { 
                title: 'Gray\'s Anatomy for Students', 
                author: 'Richard Drake', 
                price: 4500,
                coverImage: 'https://i.ibb.co/8LrtM194/Screenshot-2025-11-02-at-12-50-17-PM.png' // Find and paste a real image URL here
            },
            { 
                title: 'Lippincott Illustrated Reviews: Biochemistry', 
                author: 'Denise Ferrier', 
                price: 2200,
                coverImage: 'https://i.ibb.co/BXsCBZx/Screenshot-2025-11-02-at-12-54-27-PM.png' // Find and paste a real image URL here
            },
            { 
                title: 'BD Chaurasia\'s Human Anatomy', 
                author: 'B. D. Chaurasia', 
                price: 3500,
                coverImage: 'https://i.ibb.co/rGNNHxnN/Screenshot-2025-11-02-at-2-37-48-PM.png' // Find and paste a real image URL here
            },
            { 
                title: 'Textbook of Medical Physiology', 
                author: 'G. K. Pal', 
                price: 1350,
                coverImage: 'https://i.ibb.co/qL59g60X/Screenshot-2025-11-02-at-2-40-50-PM.png' // Find and paste a real image URL here
            },
            { 
                title: 'Textbook of Biochemistry (Satyanarayana)', 
                author: 'U. Satyanarayana', 
                price: 1400,
                coverImage: 'https://i.ibb.co/k6QQhDLg/Screenshot-2025-11-02-at-2-42-47-PM.png'
            }
        ];
        
        let books = await Book.insertMany(seedBooks);
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books' });
    }
});

// ... (keep all the code below this)


// Payment Route
app.use('/api/payment', paymentRoutes);


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});