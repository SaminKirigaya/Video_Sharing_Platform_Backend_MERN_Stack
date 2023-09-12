require('dotenv').config()
const express = require('express')
const Routes = express.Router()


// Adding all route function
const SignUp = require('../Route Function/SignUp')


Routes.post('/signMeUp', 
SignUp 
)

module.exports = Routes