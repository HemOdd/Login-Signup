const bcrypt = require('bcrypt');
const userModel = require('./model');



module.exports = function (userSchema) {

    /**
    * Authenticate a user against the database.
    * @param username - Request object
    * @param password - Response object
    * @param callback - next function to be executed.
    */
    userSchema.statics.authenticate = function (username, password, callback) {
        this.findOne({ username: username })
            .exec(function (err, user) {
                if (err) {
                    return callback(err)
                } else if (!user) {
                    let err = new Error('User not found.');
                    err.status = 401;
                    return callback(err);
                }
                bcrypt.compare(password, user.password, function (err, result) {
                    if (result === true) {
                        return callback(null, user);
                    } else {
                        return callback();
                    }
                })
            });
    }

    /**
    * Hash the password before storage.
    * @param next - next function to be executed.
    */
    userSchema.pre('save', function (next) {
        let user = this;
        bcrypt.hash(user.password, 10, function (err, hash) {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        })
    });
}