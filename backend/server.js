

const express = require('express');
const dotenv = require('dotenv');
dotenv.config(); 

const mongoose = require('mongoose');
const cors = require('cors'); 
const paymentRoutes = require('./routes/payment');
const Book = require('./models/book');


const app = express();


app.use(cors());


app.use(express.json());


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/api/books', async (req, res) => {
    try {
               await Book.deleteMany({}); 

        const seedBooks = [
            { 
                
    title: 'Guyton and Hall Textbook of Medical Physiology', 
    author: 'Guyton & Hall', 
    price: 1500,
    coverImage: 'https://i.ibb.co/6PZ0XmS/medical-physiology.jpg' // New correct link

            },
            { 
                title: 'Gray\'s Anatomy for Students', 
                author: 'Richard Drake', 
                price: 4500,
                coverImage: 'https://i.ibb.co/8LrtM194/Screenshot-2025-11-02-at-12-50-17-PM.png' 
            },
            { 
                title: 'Lippincott Illustrated Reviews: Biochemistry', 
                author: 'Denise Ferrier', 
                price: 2200,
                coverImage: 'https://i.ibb.co/BXsCBZx/Screenshot-2025-11-02-at-12-54-27-PM.png' 
            },
            { 
                title: 'BD Chaurasia\'s Human Anatomy', 
                author: 'B. D. Chaurasia', 
                price: 3500,
                coverImage: 'https://i.ibb.co/rGNNHxnN/Screenshot-2025-11-02-at-2-37-48-PM.png' 
            },
            { 
                title: 'Textbook of Medical Physiology', 
                author: 'G. K. Pal', 
                price: 1350,
                coverImage: 'https://i.ibb.co/qL59g60X/Screenshot-2025-11-02-at-2-40-50-PM.png' 
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





app.use('/api/payment', paymentRoutes);


git push
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});