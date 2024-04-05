const express = require('express');
const db = require('./db');

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());  // req.body


app.get('/', (req, res) => {
  res.send('Hello World');
})


// Import the router files
const personRoutes = require('./routes/personRoutes')
const menuRoutes = require('./routes/menuRoutes');

// use the routes
app.use('/person', personRoutes);
app.use('/menu', menuRoutes);


app.listen(8000, () => {
  console.log("Server started ");
})