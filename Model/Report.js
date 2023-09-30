const DB = require('./DB')
const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    videoSerial : {
        type : String,
        required : true,

    },
    reportedBy : {
        type : String,
        required : true,

    }
})


const Report = mongoose.model('Report', userSchema);

module.exports = Report;