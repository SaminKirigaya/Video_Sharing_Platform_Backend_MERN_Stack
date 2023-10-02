const DB = require('./DB')
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true,
    },
    username : {
        type : String,
        required : true,
        trim : true,
        unique : true,
    },
    fullName : {
        type : String,
        required : true,
        trim : true,
    },
    password : {
        type : String,
        trim : true,
        required : true,
    },
    profileImage : {
        type : String,
        required : true,
    },
    coverImage : {
        type : String,
        required : true,
    },
    gender : {
        type : String,
        required : true,
    },
    country : {
        type : String,
        required : true,
    },
    address : {
        type : String,
        required : true,
    },
    dateOfBirth : {
        type : Date,
        required : true,
    },
    joinedDate : {
        type : Date,
        default : Date.now,
    }
})

userSchema.index({
    username : 'text',
    fullName : 'text',
    email : 'text',
})

const VerifiedUsers = mongoose.model('VerifiedUsers', userSchema);

module.exports = VerifiedUsers;