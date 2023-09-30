
const DB = require('./DB')
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    videoSerial : {
        type : String,
        required : true,
    },
    replaySerial : {
        type : String,
        required : true,
    },
    whoGivingSerial : {
        type : String,
        required : true,
    },
    whoGivingUsername : {
        type : String,
        required : true,
    },
    whoGivingImage : {
        type : String,
        required : true,
    },
    whoseReplaySerial : {
        type : String,
        required : true,
    }, 
    reason : {
        type : String,
        required : true,
    }
})

const ReplayNotification = mongoose.model('ReplayNotification', userSchema);

module.exports = ReplayNotification