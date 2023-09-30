const UploadedVideos = require('../Model/UploadedVideos')

async function GetThisVideoDataOfMy(req, res, next){
    try{
        const {usersl} = req.params
        const {videoSl} = req.body 

        const findingVideo = await UploadedVideos.findById(videoSl)

        if(findingVideo.userSerial == usersl){
            return res.status(200).json({
                message : 'success',
                videourl : findingVideo.videoLink,
                videolike: findingVideo.likeamount,
                videodislike: findingVideo.dislikedamount,
                videouploadtime : findingVideo.uploadingDate,
                videotitle : findingVideo.title,
                videodescription: findingVideo.description,
                totalViews : findingVideo.totalviews,
            })
        }else{
            return res.status(200).json({
                message : 'Failed its not your video.'
            })
        }
    }catch(err){
        throw err
    }
}

module.exports = GetThisVideoDataOfMy