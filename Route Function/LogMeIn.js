const VerifiedUsers = require('../Model/VerifiedUsers')
const TokenDatabase = require('../Model/TokenDatabase')
const ForgotPass = require('../Model/ForgotPass')
const {v4: uuidv4} = require('uuid');
const bcrypt = require('bcrypt')
const Notification = require('../Model/Notification')
const CommentNotification = require('../Model/CommentNotification')
const ReplayNotification = require('../Model/ReplayNotification')

async function LogMeIn(req, res, next){
    try{
        const {Email, Password} = req.body

        const isVerified = await VerifiedUsers.findOne({email : Email})
        var notificationAmount = 0

        if(isVerified){

            const passInMainDb = isVerified.password
            const passInForgot = await ForgotPass.findOne({email : Email})

            const comparePass1 = await bcrypt.compare(Password, passInMainDb)
            const comparePass2 = await bcrypt.compare(Password, passInForgot.password)

            if(comparePass1 || comparePass2){
                const newToken = uuidv4()
                const inToken = await TokenDatabase.findOne({username : isVerified.username})
                if(inToken){
                    await TokenDatabase.deleteOne({username : isVerified.username})
                }

                const setNewToken = new TokenDatabase({
                    token : newToken,
                    username : isVerified.username,
                })

                await setNewToken.save()

                const normalNotification = await Notification.find({whosePostSerial : isVerified._id})
                if(normalNotification.length>1){
                    notificationAmount += normalNotification.length
                }else if(normalNotification[0]){
                    notificationAmount += 1
                }

                const commentNotification = await CommentNotification.find({whoseCommentSerial : isVerified._id})
                if(commentNotification.length>1){
                    notificationAmount += commentNotification.length
                }else if(commentNotification[0]){
                    notificationAmount += 1
                }

                const replayNotification = await ReplayNotification.find({whoseReplaySerial : isVerified._id})
                if(replayNotification.length>1){
                    notificationAmount += replayNotification.length
                }else if(replayNotification[0]){
                    notificationAmount += 1
                }


                return res.status(200).json({
                    message : 'Login Successful ...',
                    token : newToken,
                    username : isVerified.username,
                    serial : isVerified._id,
                    profileImg : isVerified.profileImage,
                    coverImg : isVerified.coverImage,
                    notificationTotal : notificationAmount, 
                })

            }else{
                return res.status(200).json({
                    message : 'Sorry the password you provided doesn\'t match ...'
                })
            }
            

        }else{
            return res.status(200).json({
                message : 'Sorry the email you provided is invalid ...'
            })
        }


    }catch(err){
        throw err
    }
}

module.exports = LogMeIn