require('dotenv').config()
const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const morgan = require('morgan')
const mongoose = require('mongoose')
const DB = require('./Model/DB')


const app = express() // making express app

app.use(cors()) // setting cors

app.use(morgan('tiny')) // setting morgan to see any error in console

app.use(express.json()) // to get form data or any post json data

// setting static folders so we can set links :

app.use('/public/images',express.static(__dirname + '/public/images'))
app.use('/public/videos',express.static(__dirname + '/public/videos'))
app.use('/public/thumbnails',express.static(__dirname + '/public/thumbnails'))


// set rout handle middleware 
function routeHandle(req, res, next){
    try{
        let Routes = require('./Route/Routes')
        app.use(Routes)

        next()
    }catch(err){
        console.log(err)
        throw err
    }
}

app.use(routeHandle) // setting initially whenevr a rout comes it requires that function and execute it


// setting error handle :
app.use((err, req, res, next)=>{
    console.error('THIS ERROR OCCURED',err)
    res.status(500).json({
        message : err
    })
    next()
})


console.log('Database Connected Successfully ...')
app.listen(process.env.PORT,()=>{
    console.log(`SERVER RUNNING at PORT .... ${process.env.PORT}`)
})