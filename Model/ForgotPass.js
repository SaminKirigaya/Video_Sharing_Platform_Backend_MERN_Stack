const DB = require('./DB')
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
        trim : true,
       
    }
})

const ForgotPass = mongoose.model('ForgotPass', userSchema);

module.exports = ForgotPass;