require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(process.env.DBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const DB = mongoose.connection ;

DB.on('error', console.error.bind(console, 'MONGO DB CONNECTION ERROR : '));
DB.once('open', ()=>{
    console.log('MONGO DB CONNECTION SUCCESSFUL ...')
})

module.exports = DB ;