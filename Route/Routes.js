require('dotenv').config()
const express = require('express')
const Routes = express.Router()
const upload = require('../Middleware/Multer')


// Adding all route function
const SignUp = require('../Route Function/SignUp')
const VerifyOtp = require('../Route Function/VerifyOtp')
const LogMeIn = require('../Route Function/LogMeIn')
const ForgotPassword = require('../Route Function/ForgotPassword')

// main rest Api's

Routes.post('/signMeUp', 
upload.fields([
    { name : 'Profile_Image', maxCount : 1},
    { name : 'Cover_Image', maxCount : 1},        
]),
SignUp 
)

Routes.post('/verifyOtp', 
VerifyOtp 
)

Routes.post('/logMeIn', 
LogMeIn 
)


Routes.post('/fortgotPassword', 
ForgotPassword 
)

module.exports = Routes