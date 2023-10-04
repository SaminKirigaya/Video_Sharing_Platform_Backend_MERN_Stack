const Notification  = require('../Model/Notification')
const CommentNotification = require('../Model/CommentNotification')
const ReplayNotification = require('../Model/ReplayNotification')
const { estimatedDocumentCount } = require('../Model/UploadedVideos')


async function GetAllNotifications(req, res, next){
    try{
        const {usersl} = req.params 
        
        var arrayConverted = []

        const notification = await Notification.find({whosePostSerial : usersl})
        const commentNotification = await CommentNotification.find({whoseCommentSerial : usersl})
        const replayNotification = await ReplayNotification.find({whoseReplaySerial : usersl})
        
        if(notification.length>1){
            notification.map((each)=>{
                arrayConverted.push(each)
            })
        }else if(notification[0]){
            arrayConverted.push(notification[0])
        }


        if(commentNotification.length>1){
            commentNotification.map((each)=>{
                arrayConverted.push(each)
            })
        }else if(commentNotification[0]){
            arrayConverted.push(commentNotification[0])
        }


        if(replayNotification.length>1){
            replayNotification.map((each)=>{
                arrayConverted.push(each)
            })
        }else if(replayNotification[0]){
            arrayConverted.push(replayNotification[0])
        }

        
        
        


        if(arrayConverted[0]){
            return res.status(200).json({
                message : 'success',
                allNotifications : arrayConverted,
            })
        }else{
            return res.status(200).json({
                message : 'Failed'
            })
        }

    }catch(err){
        throw err
    }
}

module.exports = GetAllNotifications