const bcryptPromise = require('./promise-bcrypt');
bcrypt = require('bcrypt')
const handler = require('./handler')
const hashRounds = 10;



module.exports = function (userSchema) {

    /**
    * Authenticate a user against the database.
    * @param email - Input email
    * @param password - Input password
    * @param callback - next function to be executed.
    */

    userSchema.statics.authenticate = function (email,password) {
        return new Promise((resolve,reject) => {
            this.findOne({email:email}).exec(function (err,user) {
                if (err) {
                    return reject(err)
                } else if (!user) {
                    let err = new Error('User not found.');
                    err.status = 401;
                    return reject (err);
                }

                const {error:encError, data: result} = handler (bcryptPromise.compare(password,user.password))

                if (encError) {
                    return reject(new Error ("Wrong email or password."))
                } else if(!result){
                    return reject(new Error ("no result"))
                } else {
                    return user
                }
                
                
            })
        })
    }
    // userSchema.statics.authenticate = function (email, password, callback) {
    //     this.findOne({ email: email })
    //         .exec(function (err, user) {
    //             if (err) {
    //                 return callback(err)
    //             } else if (!user) {
    //                 let err = new Error('User not found.');
    //                 err.status = 401;
    //                 return callback(err);
    //             }
    //             bcrypt.compare(password, user.password, function (err, result) {

    //                 if (err){
    //                     const err = new Error('Wrong email or password.');
    //                     err.status = 401;
    //                     return next(err);
    //                 } else if (result) {
    //                     return callback(null, user);
    //                 } else {
    //                     return callback();
    //                 }
    //             })
    //         });
    // }

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