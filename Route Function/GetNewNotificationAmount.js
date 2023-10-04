const Notification = require('../Model/Notification')
const CommentNotification = require('../Model/CommentNotification')
const ReplayNotification = require('../Model/ReplayNotification')

async function GetNewNotificationAmount(req, res, next){
    try{    

        const {usersl} = req.params
        var notificationAmount = 0

        const normalNotification = await Notification.find({whosePostSerial : usersl})
        if(normalNotification.length>1){
            notificationAmount += normalNotification.length
        }else if(normalNotification[0]){
            notificationAmount += 1
        }

        const commentNotification = await CommentNotification.find({whoseCommentSerial : usersl})
        if(commentNotification.length>1){
            notificationAmount += commentNotification.length
        }else if(commentNotification[0]){
            notificationAmount += 1
        }

        const replayNotification = await ReplayNotification.find({whoseReplaySerial : usersl})
        if(replayNotification.length>1){
            notificationAmount += replayNotification.length
        }else if(replayNotification[0]){
            notificationAmount += 1
        }


        return res.status(200).json({
            message : 'success',
            notificationTotal : notificationAmount, 
        })

    }catch(err){
        throw err
    }

}

module.exports = GetNewNotificationAmount