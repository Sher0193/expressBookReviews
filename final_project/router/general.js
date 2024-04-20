const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

function getAllBooks() {
  return new Promise((resolve) => {
    resolve(books);
  });
}

function getBookByISBN(isbn) {
  return new Promise((resolve) => {
    resolve(books[isbn]);
  });
}

function getBooksByAuthor(author) {
  return new Promise((resolve) => {
    let filteredBooks = Object.values(books).filter((book) => book.author === author);
    resolve(filteredBooks);
  });
}

function getBooksByTitle(title) {
  return new Promise((resolve) => {
    let filteredBooks = Object.values(books).filter((book) => book.title === title);
    resolve(filteredBooks);
  });
}

public_users.post("/register", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  if ( !username ) {
    return res.status(400).json({message: "A non-empty username was not provided."});
  }
  if ( !password ) {
    return res.status(400).json({message: "A non-empty password was not provided."});
  }
  let filteredUsers = users.filter((user) => user.username = username);
  if (filteredUsers.length > 0) {
    return res.status(400).json({message: "A user with this username already exists."});
  }
  let newUser = {
    'username': username,
    'password': password
  }
  users.push(newUser);
  return res.status(200).json({message: "A new user has been registered", "username": newUser.username});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  let books = await getAllBooks();
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  let isbn = req.params.isbn;
  let book = await getBookByISBN(isbn);
  if ( book ) {
    return res.status(200).json(book);
  }
  return res.status(404).json({message: "Book not found matching this ISBN."});
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  let author = req.params.author;
  let filteredBooks = await getBooksByAuthor(author);
  if ( filteredBooks.length ) {
    return res.status(200).json(filteredBooks);
  }
  return res.status(404).json({message: "No books found matching this author."});
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  let title = req.params.title;
  let filteredBooks = await getBooksByTitle(title);
  if ( filteredBooks.length ) {
    return res.status(200).json(filteredBooks);
  }
  return res.status(404).json({message: "No books found matching this title."});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  if ( books[isbn] ) {
    return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({message: "Book not found matching this ISBN."});
});

module.exports.general = public_users;
