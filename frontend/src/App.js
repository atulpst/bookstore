import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import Book from './components/Book';
import Admin from './Admin'; 
import './App.css';

function App() {
    const [allBooks, setAllBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch Books
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                // Using your live Render backend
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

    // Search Logic
    useEffect(() => {
        if (allBooks.length > 0) {
            const results = allBooks.filter(book =>
                book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.author.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredBooks(results);
        }
    }, [searchTerm, allBooks]);

    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <h1>Shri Sai Book Supplier</h1>
                    
                    {/* --- NAVIGATION BUTTONS (New!) --- */}
                    <nav style={{ marginBottom: '15px' }}>
                        <Link to="/" style={navStyle}>🏠 Home</Link>
                        <Link to="/admin" style={navStyle}>⚙️ Admin Panel</Link>
                    </nav>

                    {/* Search Bar */}
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
                    <Routes>
                        {/* Route 1: Home Page - Shows the Books */}
                        <Route path="/" element={
                            <div className="book-container">
                                {loading ? (
                                    <p>Loading books...</p>
                                ) : (
                                    filteredBooks.map((book) => (
                                        <Book key={book._id} book={book} />
                                    ))
                                )}
                            </div>
                        } />

                        {/* Route 2: Admin Page - Shows the Form */}
                        <Route path="/admin" element={<Admin />} />
                    </Routes>
                </main>

                <footer className="footer">
                    <p>&copy; {new Date().getFullYear()} Shri Sai Book Supplier.</p>
                </footer>
            </div>
        </Router>
    );
}

// Simple style for the buttons
const navStyle = {
    margin: '0 15px',
    color: 'white',
    textDecoration: 'none',
    fontSize: '18px',
    fontWeight: 'bold',
    border: '1px solid white',
    padding: '5px 10px',
    borderRadius: '5px'
};

export default App;