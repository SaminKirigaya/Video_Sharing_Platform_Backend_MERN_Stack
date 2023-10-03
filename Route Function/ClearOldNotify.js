const Notification = require('../Model/Notification')
const CommentNotification = require('../Model/CommentNotification')
const ReplayNotification = require('../Model/ReplayNotification')

async function ClearOldNotify(req, res, next){
    try{
        const {usersl} = req.params
        await Notification.deleteMany({whosePostSerial:usersl})
        await CommentNotification.deleteMany({whoseCommentSerial:usersl})
        await ReplayNotification.deleteMany({whoseReplaySerial:usersl})

        return res.status(200).json({
            message:'success'
        })
    }catch(err){
        throw err
    }
}

module.exports=ClearOldNotify