const express = require('express');
const axios = require('axios');
const public_users = express.Router();
const books = require('./booksdb.js'); // Local book data

// Simulate an asynchronous operation using Axios
const fetchBooksAsync = async () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books); // Resolve with the local book data
        }, 1000); // Simulate a 1-second delay
    });
};

// Task 10: Get the list of books using Async/Await
public_users.get('/', async (req, res) => {
    try {
        const books = await fetchBooksAsync(); // Fetch books asynchronously
        res.status(200).json(books);
    } catch (err) {
        res.status(500).json({ message: "Error fetching books" });
    }
});

// Task 11: Get book details by ISBN using Async/Await
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const books = await fetchBooksAsync(); // Fetch books asynchronously
        const book = books[isbn];
        if (book) {
            res.status(200).json(book);
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error fetching book details" });
    }
});

// Task 12: Get book details by Author using Async/Await
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
        const books = await fetchBooksAsync(); // Fetch books asynchronously
        const booksByAuthor = Object.values(books).filter(book => book.author === author);
        if (booksByAuthor.length > 0) {
            res.status(200).json(booksByAuthor);
        } else {
            res.status(404).json({ message: "No books found for this author" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error fetching books by author" });
    }
});

// Task 13: Get book details by Title using Async/Await
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;
    try {
        const books = await fetchBooksAsync(); // Fetch books asynchronously
        const booksByTitle = Object.values(books).filter(book => book.title === title);
        if (booksByTitle.length > 0) {
            res.status(200).json(booksByTitle);
        } else {
            res.status(404).json({ message: "No books found with this title" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error fetching books by title" });
    }
});

module.exports.general_async = public_users;