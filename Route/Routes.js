require('dotenv').config()
const express = require('express')
const Routes = express.Router()
const upload = require('../Middleware/Multer')

// Middleware 
const Authenticate = require('../Middleware/Authenticate')

// Adding all route function
const SignUp = require('../Route Function/SignUp')
const VerifyOtp = require('../Route Function/VerifyOtp')
const LogMeIn = require('../Route Function/LogMeIn')
const ForgotPassword = require('../Route Function/ForgotPassword')
const LogMeOut = require('../Route Function/LogMeOut')

// main rest Api's

Routes.post('/signMeUp',  // sign up api
upload.fields([
    { name : 'Profile_Image', maxCount : 1},
    { name : 'Cover_Image', maxCount : 1},        
]),
SignUp 
)

Routes.post('/verifyOtp', // verify otp api
VerifyOtp 
)

Routes.post('/logMeIn', // login api
LogMeIn 
)


Routes.post('/fortgotPassword', // forgot pass api
ForgotPassword 
)

Routes.get('/logMeOut/:usersl', // log out api
Authenticate, 
LogMeOut 
)






module.exports = Routes // exporting routs