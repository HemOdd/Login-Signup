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

    userSchema.statics.authenticate = async function (email, password) {

        try{

            const {err:err, data:user} = await handler(this.findOne({ email: email }));

            if (err){
                return new Error('User not found')
            } else if (user) {
                const {error:error, data:result} = await handler(bcrypt.compare(password, user.password));
                if (error){
                    return new Error('An error occured')
                } else if(result){
                    return user
                }
            }

        } catch (error) {
            return (error);
        }

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