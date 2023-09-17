require('dotenv').config()
const express = require('express')
const Routes = express.Router()
const upload = require('../Middleware/Multer')
const Video  = require('../Middleware/Video')



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
const SetNewPass = require('../Route Function/SetNewPass')
const DeleteId = require('../Route Function/DeleteId')
const UploadTheFile = require('../Route Function/UploadTheFile')
const ShowOldVideos = require('../Route Function/ShowOldVideos')
const AddThisToWatchList = require('../Route Function/AddThisToWatchList')

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


Routes.post('/setNewPassword/:usersl',  // setting new pass in id and checking if old pass provided is same
Authenticate, 
SetNewPass 
)


Routes.get('/deleteThisId/:usersl',  // deleting total account
Authenticate, 
DeleteId 
)


Routes.post('/uploadmyfile/:usersl',  // uploading videos
Authenticate, 
Video.fields([
    { name : 'Video', maxCount : 1},
    { name : 'Thumbnail', maxCount : 1},        
]),
UploadTheFile 
)


Routes.get('/getOldUploadedVideos/:usersl',  // api to call old uploaded vids
Authenticate, 
ShowOldVideos 
)


Routes.post('/addThisToWatchList/:usersl', 
Authenticate, 
AddThisToWatchList 
)



module.exports = Routes // exporting routs