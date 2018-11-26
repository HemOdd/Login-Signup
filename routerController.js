const userModel = require('./model');
const bcrypt = require('bcrypt');


/**
 * Get function for execution at root.
 * @param req - Request object
 * @param res - Response object
 * @param next - next function to be executed.
 */
exports.getFunc = function (req, res, next) {

  res.sendFile(__dirname + '/login.html');

}

/**
 * Post function for execution at root.
 * @param req - Request object
 * @param res - Response object
 * @param next - next function to be executed.
 */  
exports.postFunc = function (req, res, next) {

  if (req.body.email &&
    req.body.username &&
    req.body.password) {
  
    let userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    }
    
    //Create a user in db.
    //The error code 11000 means there is a user with the same email already in db.
    userModel.create(userData, function (error, user) {
      if (error && error.code === 11000) {

        res.send('Email is already registered!');

      } else if(error && error.code !=11000){

        res.send('An error occured!');

      } else {
        res.send('Sign Up Successful!');
      }
    });
  //Log the user in if there is no error in authentication.
  } else if (req.body.logUser && req.body.logPass) {
    userModel.authenticate(req.body.logUser, req.body.logPass, function (error, user) {
      if (error || !user) {
        
        const err = new Error('Wrong username or password.');
        err.status = 401;
        return next(err);
      } else {
        res.send('Login Successful!')
      }
    });
  } else {
    const err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
}