
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
    whoseCommentSerial : {
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
    replay : {
        type: String,
        required: true
    },
    replayLove: {
        type: Number, 
        required : true,
    },
    replayDislove: {
        type: Number, 
        required : true,
    },
    replayingTime : {
        type : Date,
        default : Date.now,
    }
})

const CommentReplay = mongoose.model('CommentReplay', userSchema);

module.exports = CommentReplay