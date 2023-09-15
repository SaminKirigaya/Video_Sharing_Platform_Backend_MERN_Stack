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
const GetMyUserData = require('../Route Function/GetMyUserData')
const SetProfileDataNoImg = require('../Route Function/SetProfileDataNoImg')
const SetProfileDataBothImg = require('../Route Function/SetProfileDataBothImg')
const SetProfileDataProfImg = require('../Route Function/SetProfileDataProfImg')
const  SetProfileDataCoverImg = require('../Route Function/SetProfileDataCoverImg')

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


Routes.get('/getMyProfileData/:usersl', // getting own profile data
Authenticate, 
GetMyUserData 
)

Routes.post('/setMyNewDetailsNoImg/:usersl', // no image added in form based
Authenticate, 
SetProfileDataNoImg
)


Routes.post('/setMyNewDetailsBothImg/:usersl', // both image added in form based
Authenticate, 
upload.fields([
    { name : 'ProfileImage', maxCount : 1},
    { name : 'CoverImage', maxCount : 1},        
]),
SetProfileDataBothImg
)



Routes.post('/setMyNewDetailsProfImg/:usersl', // profile image added in form only
Authenticate, 
upload.fields([
    { name : 'ProfileImage', maxCount : 1},
]),
SetProfileDataProfImg
)



Routes.post('/setMyNewDetailsCoverImg/:usersl', // cover image added in form only
Authenticate, 
upload.fields([
    { name : 'CoverImage', maxCount : 1},
]),
SetProfileDataCoverImg
)






module.exports = Routes // exporting routs