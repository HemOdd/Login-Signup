// const bcryptPromise = require('./promise-bcrypt');
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

    userSchema.statics.authenticate = function (email, password) {
        return new Promise((resolve, reject) => {
            this.findOne({ email: email }).exec(function (err, user) {
                if (err) {
                    return reject(err)
                } else if (!user) {
                    const err = new Error('User not found.');
                    err.status = 401;
                    return reject(err);
                }

                bcrypt.compare(password, user.password, function (err, result) {

                    if (err) {
                        err.status = 401;
                        reject(err);
                    } else if (result) {
                        resolve(user)
                    }
                })


            })
        })
    }

    /**
    * Hash the password before storage.
    * @param next - next function to be executed.
    */

    userSchema.pre('save', async function () {

        try {
            let user = this;
            const {error: err, data: hashVal} = await handler(bcrypt.hash(user.password, hashRounds));
            if (err){
                return (err)
            } else {
                
                user.password = hashVal;
            }
        } catch (error) {
            return (error)
        }
    });



}