const bcrypt = require('bcrypt');
const userModel = require('./model');
// const session = require('express-session');



module.exports = function (userSchema) {

    /**
    * Authenticate a user against the database.
    * @param name - Input name
    * @param password - Input password
    * @param callback - next function to be executed.
    */
    userSchema.statics.authenticate = function (email, password, callback) {
        this.findOne({ email: email })
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