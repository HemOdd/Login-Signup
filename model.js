
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');


/**
* Schema containing user credentials.
* All of the fields are required.
* Only email should be unique.
*/
let userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: false,
    required: true,
    trim: true
  },
  password: {
    type: String,
    unique: false,
    required: true
  }
});

//Import the schema functions.
//These can be later invoked via function calls on the schema directly.
require('./schemaController')(userSchema)

let User = mongoose.model('User', userSchema);
module.exports = User;
