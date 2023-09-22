const VerifiedUsers = require('../Model/VerifiedUsers')
const UploadedVideos = require('../Model/UploadedVideos')


async function DataMainVideoPage(req, res, next){
    try{
        const {videoSl} = req.body 
        const findingVideo = await UploadedVideos.findById(videoSl).lean()

        if(findingVideo){

            const userData = await VerifiedUsers.findById(findingVideo.userSerial)
           
            findingVideo.userName = userData.username
            findingVideo.userImage = userData.profileImage
        

            console.log(findingVideo)

            return res.status(200).json({
                message : 'success',
                videourl : findingVideo.videoLink,
                videolike: findingVideo.likeamount,
                videodislike: findingVideo.dislikedamount,
                videouploadtime : findingVideo.uploadingDate,
                videotitle : findingVideo.title,
                videodescription: findingVideo.description,
                videousername : findingVideo.userName,
                videouserimage : findingVideo.userImage,
                videotags : findingVideo.tags,
            })

        }else{
            return res.status(200).json({
                message: 'Failed to retrive data ...'
            })
        }

    }catch(err){
        throw err
    }
}

module.exports = DataMainVideoPage