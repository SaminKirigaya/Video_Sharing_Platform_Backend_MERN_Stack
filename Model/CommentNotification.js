
const DB = require('./DB')
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    videoSerial : {
        type : String,
        required : true,
    },
    commentSerial : {
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
    whoseCommentSerial : {
        type : String,
        required : true,
    }, 
    reason : {
        type : String,
        required : true,
    }
})

const CommentNotification = mongoose.model('CommentNotification', userSchema);

module.exports = CommentNotification