const DB = require('./DB')
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userSerial : {
        type : String,
        required : true,
       
    },
    videoId : {
        type : String,
        required : true,
    }
})

const WatchList = mongoose.model('WatchList', userSchema);

module.exports = WatchList;