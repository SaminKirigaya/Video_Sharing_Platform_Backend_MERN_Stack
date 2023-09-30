const UploadedVideos = require('../Model/UploadedVideos')
const WatchList = require('../Model/WatchList')
const LoveReact = require('../Model/LoveReact')
const DisLoveReact = require('../Model/DisLoveReact')
const Notification = require('../Model/Notification')

const Comment = require('../Model/Comment')
const CommentLove = require('../Model/CommentLove')
const CommentDislove = require('../Model/CommentDislove')
const CommentNotification = require('../Model/CommentNotification')

const CommentReplay = require('../Model/CommentReplay')
const ReplayLove = require('../Model/ReplayLove')
const ReplayDislove = require('../Model/ReplayDislove')
const ReplayNotification = require('../Model/ReplayNotification')

const fs = require('fs')


async function DeleteThisVideo(req, res, next){
    try{
        const {usersl} = req.params 
        const {videoSlNo} = req.body 

        const isitMine = await UploadedVideos.findById(videoSlNo)

        if(isitMine.userSerial == usersl){
            var videoname = isitMine.videoLink
            var splitting = videoname.split('/')
            videoname = splitting[splitting.length-1]
            var videoPath = `public/videos/${videoname}`
            fs.unlinkSync(videoPath)

            var thumbname = isitMine.thumbnailLink
            var splitting2 = thumbname.split('/')
            thumbname = splitting2[splitting2.length-1]
            var thumbPath = `public/videos/${thumbname}`
            fs.unlinkSync(thumbPath)

            
            await UploadedVideos.findByIdAndDelete(videoSlNo) // deleting video from upload database
            await WatchList.deleteMany({videoId : videoSlNo}) //anyone who addded it in their watchlist will no longer find it
            await LoveReact.deleteMany({videoSerial: videoSlNo}) // deleting from love react db table
            await DisLoveReact.deleteMany({videoSerial: videoSlNo}) // deleting from dislove react db table
            await Notification.deleteMany({videoSerial: videoSlNo}) // delete video serial from notification db table 

            await Comment.deleteMany({videoSerial: videoSlNo}) // deleting comment of specific videosl
            await CommentLove.deleteMany({videoSerial: videoSlNo}) // deleting specific comment love react all 
            await CommentDislove.deleteMany({videoSerial: videoSlNo}) // deleting specific comment hate react all
            await CommentNotification.deleteMany({videoSerial: videoSlNo}) // deleting all notif so user wont be able t go see it after delete

            await CommentReplay.deleteMany({videoSerial: videoSlNo}) // deleting comment replay of specific videosl
            await ReplayLove.deleteMany({videoSerial: videoSlNo}) // deleting from love react of replay db table
            await ReplayDislove.deleteMany({videoSerial: videoSlNo}) // deleting from dislove react replay db table
            await ReplayNotification.deleteMany({videoSerial: videoSlNo}) // deleting all replay notification regarding this video
            
            return res.status(200).json({
                message : 'success',
            })
        }else{
            return res.status(200).json({
                message : 'It is not even your video ... '
            })
        }
    }catch(err){
        throw err
    }
}

module.exports = DeleteThisVideo