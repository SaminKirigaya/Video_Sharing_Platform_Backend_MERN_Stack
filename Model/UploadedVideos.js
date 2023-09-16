const DB = require('./DB')
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userSerial : {
        type : String,
        required : true,
        
    },
    title : {
        type : String,
        required : true,
        trim : true,
    },
    description : {
        type : String,
        trim : true,
        required : true,
    },
    tags : {
        type : String,
        required : true,
    },
    videoLink : {
        type : String,
        required : true,
    },
    thumbnailLink : {
        type : String,
        required : true,
    },
    uploadingDate : {
        type : Date,
        default : Date.now,
    }
})

userSchema.index({
    title : 'text',
    description : 'text',
    tags : 'text',
})

const UploadedVideos = mongoose.model('UploadedVideos', userSchema);

module.exports = UploadedVideos;