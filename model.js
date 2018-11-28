
const mongoose = require('mongoose');

//Import the schema functions.
//These can be later invoked via function calls on the schema directly.
require('./schemaController')(userSchema)



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
  name: {
    type: String,
    unique: false,
    required: true,
    trim: true
  },
  surname: {
    type: String,
    unique: false,
    required: true
  },
  password: {
    type: String,
    unique: false,
    required: true
  },
  birthdate: {
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


module.exports = mongoose.model('User', userSchema);;
