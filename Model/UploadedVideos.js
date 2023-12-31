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
    },
    likeamount: {
        type : Number,
        required : true,
    },
    dislikedamount : {
        type : Number,
        required : true,
    },
    totalviews:{
        type : Number,
        required : true,
    }
})

userSchema.index({
    tags : 'text',
    description : 'text',
    title : 'text',
    
})

const UploadedVideos = mongoose.model('UploadedVideos', userSchema);

module.exports = UploadedVideos;