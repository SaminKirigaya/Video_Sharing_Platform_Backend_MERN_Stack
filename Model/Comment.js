
const DB = require('./DB')
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    videoSerial : {
        type : String,
        required : true,
    },
    whoGivingSerial : {
        type : String,
        required : true,
    },
    whosePostSerial : {
        type : String,
        required : true,
    },
    whoGivingImage : {
        type : String,
        required : true,
    },
    whoGivingUsername : {
        type : String,
        required : true,
    },
    comment : {
        type: String,
        required: true
    },
    commentLove: {
        type: Number, 
        required : true,
    },
    commentDislove: {
        type: Number, 
        required : true,
    },
    commentingTime : {
        type : Date,
        default : Date.now,
    }
})

const Comment = mongoose.model('Comment', userSchema);

module.exports = Comment