
const mongoose = require('mongoose');





/**
* Schema containing user credentials.
* All of the fields are required.
* Only email should be unique.
*/
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  firstName: {
    type: String,
    unique: false,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    unique: false,
    required: true
  },
  password: {
    type: String,
    unique: false,
    required: true
  },
  dateOfBirth: {
    type: String,
    unique: false,
    required: true
  },
  age: {
    type: String,
    unique: false,
    required: true
  }
});

//Import the schema functions.
//These can be later invoked via function calls on the schema directly.
require('./schemaController')(userSchema)
module.exports = mongoose.model('User', userSchema);;
