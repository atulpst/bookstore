// frontend/src/App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Book from './components/Book';
import './App.css';

function App() {
    const [allBooks, setAllBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch books from the backend API
        const fetchBooks = async () => {
            try {
                // Use the live Render URL
                const { data } = await axios.get('https://bookstore-0o25.onrender.com/api/books');
                setAllBooks(data);
                setFilteredBooks(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching books:", error);
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    // Handle search filtering
    useEffect(() => {
        const results = allBooks.filter(book =>
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredBooks(results);
    }, [searchTerm, allBooks]);

    return (
        <div className="App">
            <header className="App-header">
                <h1>Shri Sai Book Supplier</h1>
                <div className="search-bar">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search by title or author..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>
            
            <main className="main-content">
                <div className="book-container">
                    {loading ? (
                        <p>Loading books...</p>
                    ) : (
                        filteredBooks.map((book) => <Book key={book._id} book={book} />)
                    )}
                </div>
            </main>

            <footer className="footer">
                <p>&copy; {new Date().getFullYear()} Shri Sai Book Supplier. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default App;