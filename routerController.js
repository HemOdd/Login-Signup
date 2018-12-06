const userModel = require('./model');
const bcrypt = require('bcrypt');
const moment = require('moment');
const handler = require('./handler')
const hashRounds = 10;


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

exports.postFunc = async function (req,res) {

  try{

    if (req.body.email &&
      req.body.name &&
      req.body.password && req.body.surname && req.body.birthdate){
  
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
        const newUser = new userModel(userData);
        const{error:err, data:saved} = await handler(newUser.save());
  
        if (err && err.code === 11000){
          res.send('Email is already registered!')
        } else if (err) {
          res.send('Unknown error while signing up')
        } else {
          req.session.userId = saved._id
          const{error:error, data:user} = await handler(userModel.findById(req.session.userId));
  
          if (error){
            res.send('User not found')
          } else if (user){
            res.render("profile", { name: user.firstName, surname: user.lastName, email: user.email, birthdate: user.dateOfBirth, age: user.age });
          }
        }
  
  
      } else if (req.body.logEmail && req.body.logPass){
  
        const {error:authErr, data: user} = await handler(userModel.authenticate(req.body.logEmail, req.body.logPass))
  
        if (authErr) {
          res.send("Authentication error")
        } else if (user) {
          req.session.userId = user._id
          const{error:error, data:saved} = await handler(userModel.findById(req.session.userId));
  
          if (error){
            res.send('User not found')
          } else if (saved){
            res.render("profile", { name: saved.firstName, surname: saved.lastName, email: saved.email, birthdate: saved.dateOfBirth, age: saved.age });
          }
        }
      }

  }catch(error){

    res.send("An error occured.");

  }
}

// exports.postFunc = function (req, res) {

//   return new Promise((resolve, reject) => {
//     if (req.body.email &&
//       req.body.name &&
//       req.body.password && req.body.surname && req.body.birthdate) {

//       const currentYear = (new Date()).getFullYear();
//       const date = new Date(req.body.birthdate);
//       const userAge = Math.abs(date.getUTCFullYear() - currentYear);
//       const formatted = moment(date).format('D MMMM YYYY');

//       let userData = {
//         email: req.body.email,
//         firstName: req.body.name,
//         password: req.body.password,
//         lastName: req.body.surname,
//         dateOfBirth: formatted,
//         age: userAge
//       }

//       const newUser = new userModel(userData);
//       newUser.save().then(saved => {
//         req.session.userId = saved._id
//         userModel.findById(req.session.userId)
//           .then(user => res.render("profile", { name: user.firstName, surname: user.lastName, email: user.email, birthdate: user.dateOfBirth, age: user.age }))
//       }).catch(err => {
//         if (err.code === 11000) {
//           res.send('Email is already registered!')
//         } else {
//           res.send('Unknown error at sign up')
//         }
//       });

//     } else if (req.body.logEmail && req.body.logPass) {

//       userModel.authenticate(req.body.logEmail, req.body.logPass).then(user => {
//         req.session.userId = user._id
//         userModel.findById(req.session.userId)
//           .then(user => res.render("profile", { name: user.firstName, surname: user.lastName, email: user.email, birthdate: user.dateOfBirth, age: user.age }))
//       }).catch(err => res.send('Wrong user or pass.'))
//     }
//   })
// }



exports.postEditForm = async function (req, res) {

  try{
    if (req.body.name) {
      const { error: err, data: doc } = await handler(userModel.findByIdAndUpdate(req.session.userId, { $set: { firstName: req.body.name } }, { new: true }));
      if (err) {
        return err;
      }
    }
    if (req.body.password) {
      const { error: error, data: hash } = await handler(bcrypt.hash(req.body.password, hashRounds));
      if (error) {
        return err;
      } else {
        const { error: err, data: doc } = await handler(userModel.findByIdAndUpdate(req.session.userId, { $set: { password: hash } }, { new: true }));
        if (err) {
          return err;
        }
      }
  
    }
  
    const {error: err, data: user} = await handler(userModel.findById(req.session.userId));
    if (err){
      return err
    } else {
      res.render("profile", { name: user.firstName, surname: user.lastName, email: user.email, birthdate: user.dateOfBirth, age: user.age });
    }
  } catch (error){

    return error

  }

}
