const DB = require('./DB')
const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true,
    },
    otp : {
        type : String,
        required : true,
        trim : true,
        unique : true,
    }
})


const Otp = mongoose.model('Otp', userSchema);

module.exports = Otp;