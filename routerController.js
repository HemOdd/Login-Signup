const userModel = require('./model');
const bcrypt = require('bcrypt');
const session = require('express-session');



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
        //Sign Up Successful. Go to profile
        req.session.userId = user._id;
        console.log(req.session.userId);

        userModel.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized!');
          err.status = 400;
          return next(err);
        } else {
          return res.render("profile",{name: user.username,mail: user.email});
        }
      }
    });
      }
    });
  //Log the user in if there is no authentication error.
  } else if (req.body.logUser && req.body.logPass) {
    userModel.authenticate(req.body.logUser, req.body.logPass, function (error, user) {
      if (error || !user) {
        
        const err = new Error('Wrong username or password.');
        err.status = 401;
        return next(err);
      } else {
        //Login Successful. Go to profile
        req.session.userId = user._id;
        userModel.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized!');
          err.status = 400;
          return next(err);
        } else {
          return res.render("profile",{name: user.username,mail: user.email});

        }
      }
    });
      }
    });
  } else {
    const err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
}

exports.postEditForm = function (req,res,next){

  if(req.body.name || req.body.password){

    if(req.body.name){
      userModel.findByIdAndUpdate(req.session.userId, {$set:{username:req.body.name}}, {new: true}, (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
        }
    
        console.log(doc);
    });
    }

    if(req.body.password){

      bcrypt.hash(req.body.password, 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        userModel.findByIdAndUpdate(req.session.userId, {$set:{password:hash}}, {new: true}, (err, doc) => {
          if (err) {
              console.log("Something wrong when updating data!");
          }
      
          console.log(doc);
      });
      })

      
    }
    
    userModel.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        return res.render("profile",{name: user.username,mail: user.email});
      }
    })
    
  }

  

}
