const express = require('express');
const db = require('./db');
require('dotenv').config();
const app = express();


const bodyParser = require('body-parser');
app.use(bodyParser.json());  // req.body


const passport = require('./auth');
// final how to use passport
app.use(passport.initialize())
const localAuthMiddleware = passport.authenticate('local', {session: false});

// Middleware Function
const logRequest = (req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] Request Made to ${req.originalUrl}`)
  next(); // Move on to the next 
}
app.use(logRequest);


app.get('/',localAuthMiddleware, (req, res) => {
  res.send('Hello World');
})


// Import the router files
const personRoutes = require('./routes/personRoutes')
const menuRoutes = require('./routes/menuRoutes');

// use the routes
app.use('/person', personRoutes);
app.use('/menu', menuRoutes);

const PORT = process.env.PORT || 8000 // Use 3000 as a default if PORT is not defined


app.listen(8000, () => {
  console.log("Server started ");
})