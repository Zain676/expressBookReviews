const express = require("express");
const public_users = express.Router();
const books = require("./booksdb.js"); // Local book data

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

// Task 1: Get the list of books available in the shop
public_users.get("/", function (req, res) {
  res.status(200).json(JSON.stringify(books, null, 4)); // Display output neatly
});

// Task 2: Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn]; // Retrieve book by ISBN
  if (book) {
    res.status(200).json(JSON.stringify(book, null, 4)); // Display output neatly
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Task 3: Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const booksByAuthor = [];

  // Iterate through the books object
  for (const isbn in books) {
    if (books[isbn].author === author) {
      booksByAuthor.push(books[isbn]);
    }
  }

  if (booksByAuthor.length > 0) {
    res.status(200).json(JSON.stringify(booksByAuthor, null, 4)); // Display output neatly
  } else {
    res.status(404).json({ message: "No books found for this author" });
  }
});

// Task 4: Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const booksByTitle = [];

  // Iterate through the books object
  for (const isbn in books) {
    if (books[isbn].title === title) {
      booksByTitle.push(books[isbn]);
    }
  }

  if (booksByTitle.length > 0) {
    res.status(200).json(JSON.stringify(booksByTitle, null, 4)); // Display output neatly
  } else {
    res.status(404).json({ message: "No books found with this title" });
  }
});

// Task 5: Get book reviews based on ISBN
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn]; // Retrieve book by ISBN

  if (book && book.reviews) {
    res.status(200).json(JSON.stringify(book.reviews, null, 4)); // Display output neatly
  } else {
    res.status(404).json({ message: "No reviews found for this book" });
  }
});

// Task 6: Register a new user
public_users.post("/register", function (req, res) {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  const userExists = users.some((user) => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Add new user
  users.push({ username, password });
  res.status(201).json({ message: "User registered successfully" });
});

module.exports.general = public_users;
