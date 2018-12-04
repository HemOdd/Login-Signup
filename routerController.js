const userModel = require('./model');
const bcrypt = require('bcrypt');
const moment = require('moment');
const handler = require('./handler')
const hashRounds = 10;


const makeNewUser = function (inputData) {

  return new Promise((resolve, reject) => {

    userModel.create(inputData, function (error, user) {
      if (error && error.code === 11000) {
        reject(new Error('Email is already registered!'))
      } else if (error ||!user) {
        reject(new Error('Unknown error'))
      } else {
        resolve(user)       
      }
    })

  })
}

/**
 * Get function for execution at root.
 * @param req - Request object
 * @param res - Response object
 * @param next - next function to be executed.
 */

exports.getFunc = async function (req, res) {

  console.log("getFunc");

  try {
    return res.sendFile(__dirname + '/login.html');
  } catch (error) {
    return new Error("Page can not be loaded.")
  }
}


/**
 * Post function for execution at root.
 * @param req - Request object
 * @param res - Response object
 * @param next - next function to be executed.
 */

exports.postFunc = function (req, res) {

  return new Promise((resolve, reject) => {
    if (req.body.email &&
      req.body.name &&
      req.body.password && req.body.surname && req.body.birthdate) {

      const currentYear = (new Date()).getFullYear();
      const date = new Date(req.body.birthdate);
      const userAge = Math.abs(date.getUTCFullYear() - currentYear);
      const formatted = moment(date).format('D MMMM YYYY');

      let userData = {
        email: req.body.email,
        firstName: req.body.name,
        password: req.body.password,
        lastName: req.body.surname,
        dateOfBirth: formatted,
        age: userAge
      }

      makeNewUser(userData).then((user) => req.session.userId = user._id);
      

      userModel.findById(req.session.userId).exec((error, user) => {
        if (error) {
          reject(error);
        } else {
          res.render("profile", { name: user.firstName, surname: user.lastName, email: user.email, birthdate: user.dateOfBirth, age: user.age });
        }
      })

    } else if (req.body.logEmail && req.body.logPass) {
      const {error: err, data: user} = handler(userModel.authenticate(req.body.logEmail, req.body.logPass));
      if (err){
        return reject(new Error("Auth Error"))
      } else {
        if (err) {
          return reject(new Error("Sign up error."))
        } else {
          req.session.userId = user._id
        }
  
        userModel.findById(req.session.userId).exec((error, user) => {
          if (error) {
            return reject(error);
          } else {
            res.render("profile", { name: user.firstName, surname: user.lastName, email: user.email, birthdate: user.dateOfBirth, age: user.age });
          }
        })
      }
    }
  })
}


exports.postEditForm = function (req, res, next) {

  if (req.body.name || req.body.password) {

    if (req.body.name) {
      userModel.findByIdAndUpdate(req.session.userId, { $set: { firstName: req.body.name } }, { new: true }, (err, doc) => {
        if (err) {
          console.log("Something wrong when updating data!");
        }

        console.log(doc);
      });
    }

    if (req.body.password) {

      bcrypt.hash(req.body.password, hashRounds, function (err, hash) {
        if (err) {
          return next(err);
        }
        userModel.findByIdAndUpdate(req.session.userId, { $set: { password: hash } }, { new: true }, (err, doc) => {
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
          return res.render("profile", { name: user.firstName, surname: user.lastName, email: user.email, birthdate: user.dateOfBirth, age: user.age });
        }
      })

  }



}