// frontend/src/App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Book from './components/Book';
import './App.css';

function App() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const { data } = await axios.get('https://bookstore-0o25.onrender.comapi/books');
                setBooks(data);
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        };
        fetchBooks();
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <h1>📚 SHRI SAI BOOK SUPPLIER</h1>
            </header>
            <main className="book-container">
                {books.length > 0 ? (
                    books.map((book) => <Book key={book._id} book={book} />)
                ) : (
                    <p>Loading books...</p>
                )}
            </main>
        </div>
    );
}

export default App;