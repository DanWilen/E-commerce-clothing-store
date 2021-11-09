//User constructor
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

let userSchema = new Schema({
    email: {type: String, required:true},
    password: {type:String, required: true}
});

userSchema.methods.encryptPassword = function(password) //hashing password
{
    return bcrypt.hashSync(password,bcrypt.genSaltSync(5),null); //5 rounds of salt creation password
};

userSchema.methods.validPassword = function(password)
{
    return bcrypt.compareSync(password,this.password); //check if passwords matches
};



module.exports = mongoose.model('User', userSchema);
