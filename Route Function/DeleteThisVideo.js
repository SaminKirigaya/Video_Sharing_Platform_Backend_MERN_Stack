const UploadedVideos = require('../Model/UploadedVideos')
const WatchList = require('../Model/WatchList')
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
            await WatchList.findOneAndDelete({videoId : videoSlNo}) //anyone who addded it in their watchlist will no longer find it

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