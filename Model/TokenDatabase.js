const DB = require('./DB')
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    token : {
        type : String,
        required : true,
        unique : true,
        trim : true
    },
    username : {
        type : String,
        required : true,
        trim : true,
        unique : true,
    }
})

const TokenDatabase = mongoose.model('TokenDatabase', userSchema);

module.exports = TokenDatabase;