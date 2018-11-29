const bcrypt = require('bcrypt');
const hashRounds = 10;



module.exports = function (userSchema) {

    /**
    * Authenticate a user against the database.
    * @param email - Input email
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

                    if (err){
                        const err = new Error('Wrong email or password.');
                        err.status = 401;
                        return next(err);
                    } else if (result) {
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
        bcrypt.hash(user.password, hashRounds, function (err, hash) {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        })
    });


}