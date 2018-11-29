const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const dotenv = require('dotenv').config();

//Connect to MongoDB.
mongoose.connect(process.env.DB_PATH);
const db = mongoose.connection;

//Handle MongoDB errors.
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // connected
});

//Make use of Pug template engine and declare its path.
app.set("view engine", "pug");
app.set('views', './views')

//Parse incoming requests.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//Serve static files from the root directotry.
app.use(express.static(__dirname));

//Use session for maintaining user info after sign up/login.
app.use(session({ secret: 'secret'}));

//Import and use routes.
const routes = require('./router');
app.use('/', routes);
app.use('/views',routes);



//Catch 404 (file not found) error and forward to error handler.
app.use(function (req, res, next) {
  const err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

//Handle errors of app.use
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

const portNumber = 3000;
//App can be connected on localhost:3000
app.listen(portNumber, function () {
  console.log('App is listening on port 3000');
});