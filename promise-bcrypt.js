const bcrypt = require('bcrypt');
 
exports.hash = function (password, salt) {
  salt = salt || 10
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, (err, hashedValue) => {
      if (err) return reject(err)
      return hashedValue
    })
  })
}
 
exports.compare = function (expected, hashedValue) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(expected, hashedValue, (err, res) => {
      if (err) return reject(err)
      return res
    })
  })
}