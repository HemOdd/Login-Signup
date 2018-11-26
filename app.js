const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const controller = require('./routerController')

//Connect to MongoDB.
mongoose.connect('mongodb://hemad:123%40abc@ds135364.mlab.com:35364/hm_db');
const db = mongoose.connection;

//Handle MongoDB errors.
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // connected
});

//Parse incoming requests.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//Serve static files from the root directotry.
app.use(express.static(__dirname));

//Import and use routes.
const routes = require('./router');
app.use('/', routes);

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


//App can be connected on localhost:3000
app.listen(3000, function () {
  console.log('App is listening on port 3000');
});