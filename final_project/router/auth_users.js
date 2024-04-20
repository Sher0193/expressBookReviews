const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean

}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (!username || !password) {
      return res.status(400).json({message: "Missing valid username or password"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      username: username,
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).json({message: "User successfully logged in"});
  } else {
    return res.status(401).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

  let isbn = req.params.isbn;
  let book = books[isbn];
  if ( !book ) {
    return res.status(404).json({message: "No book found with this ISBN."});
  }

  book.reviews[ req.user.username ] = req.body.review;

  books[isbn] = book;

  return res.status(200).json({message: "Posted review for the book " + book.title + "."});
});

// Add a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {

  let isbn = req.params.isbn;
  let book = books[isbn];
  if ( !book ) {
    return res.status(404).json({message: "No book found with this ISBN."});
  }

  delete book.reviews[ req.user.username ];

  return res.status(200).json({message: "Deleted all reviews by the user " + req.user.username + " for the book " + book.title + "." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
