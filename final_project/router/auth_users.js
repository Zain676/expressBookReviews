const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []; // In-memory storage for registered users

// Function to check if the username is valid
const isValid = (username) => {
    return username && username.length >= 3;
};

// Function to check if the username and password match a registered user
const authenticatedUser = (username, password) => {
    const user = users.find(user => user.username === username && user.password === password);
    return !!user; // Returns true if the user exists, otherwise false
};

// Middleware for JWT authentication
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

    jwt.verify(token, 'your-secret-key', (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = user; // Attach the user object to the request
        next();
    });
};

// Task 7: Login route
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the user is authenticated
    if (authenticatedUser(username, password)) {
        const token = jwt.sign({ username }, 'your-secret-key', { expiresIn: '1h' });
        return res.status(200).json({ message: "Login successful", token });
    } else {
        return res.status(401).json({ message: "Invalid credentials" });
    }
});

// Task 8: Add/Modify book review route
regd_users.put("/auth/review/:isbn", authenticateToken, (req, res) => {
    const isbn = req.params.isbn;
    const { review } = req.body;
    const username = req.user.username; // Extracted from the JWT token

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user has already reviewed this book
    if (books[isbn].reviews[username]) {
        books[isbn].reviews[username] = review; // Modify the existing review
        return res.status(200).json({ message: "Review modified successfully" });
    } else {
        books[isbn].reviews[username] = review; // Add a new review
        return res.status(201).json({ message: "Review added successfully" });
    }
});

// Task 9: Delete book review route
regd_users.delete("/auth/review/:isbn", authenticateToken, (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username; // Extracted from the JWT token

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user has a review for this book
    if (books[isbn].reviews[username]) {
        delete books[isbn].reviews[username]; // Delete the review
        return res.status(200).json({ message: "Review deleted successfully" });
    } else {
        return res.status(404).json({ message: "No review found for this user" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
