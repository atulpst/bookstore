import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; 

const Admin = () => {
  const [book, setBook] = useState({
    title: '',
    author: '',
    price: '',
    image: '', 
    description: ''
  });

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // FIX: Changed localhost:10000 to your live Render URL
      // If your route is just '/api/books', remove the '/add' part. 
      // Assuming your backend route is defined as router.post('/add', ...)
      await axios.post('https://bookstore-0o25.onrender.com/api/books/add', book); 
      
      alert('Book Added Successfully!');
      setBook({ title: '', author: '', price: '', image: '', description: '' }); // Clear form
    } catch (error) {
      console.error("Error details:", error);
      alert('Error adding book. Check console for details.');
    }
  };

  return (
    <div className="main-content" style={{ maxWidth: '600px', margin: '50px auto' }}>
      <h2>Admin Panel: Add a Book</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input className="search-input" name="title" placeholder="Book Title" value={book.title} onChange={handleChange} required />
        <input className="search-input" name="author" placeholder="Author" value={book.author} onChange={handleChange} required />
        <input className="search-input" name="price" type="number" placeholder="Price (₹)" value={book.price} onChange={handleChange} required />
        <input className="search-input" name="image" placeholder="Image URL (http://...)" value={book.image} onChange={handleChange} required />
        <textarea className="search-input" name="description" placeholder="Description" value={book.description} onChange={handleChange} rows="4" />
        <button className="buy-button" type="submit">Add Book</button>
      </form>
    </div>
  );
};

export default Admin;