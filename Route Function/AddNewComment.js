const Comment = require ('../Model/Comment')
const UploadedVideos = require('../Model/UploadedVideos')
const VerifiedUsers = require('../Model/VerifiedUsers')
const Notification = require('../Model/Notification')


async function AddNewComment(req, res, next){
    try{
        const {usersl} = req.params 
        var {comment, videoSl} = req.body

        const videoExist  = await  UploadedVideos.findById(videoSl)
        if(videoExist){
            const userData = await VerifiedUsers.findById(usersl)

            var replacable = ["<",">","/",";"]
            var replaceWith = ["&lt;", "&gt;", "&#47;", "&#59;"]
            for (let i=0 ; i<replacable.length; i++){
                var regex = new RegExp(replacable[i],'g')
                comment = comment.replace(regex, replaceWith[i])
            }

            const newComment = new Comment({
                videoSerial : videoSl,
                whoGivingSerial : usersl,
                whoGivingUsername : userData.username,
                whoGivingImage : userData.profileImage,
                whosePostSerial : videoExist.userSerial,
                comment : comment,
                commentLove : 0,
                commentDislove: 0,
            })
            await newComment.save()

            const insertNotif = new Notification({
                videoSerial : videoSl,
                whoGivingSerial : usersl,
                whoGivingUsername : userData.username,
                whosePostSerial: videoExist.userSerial,
                whoGivingImage : userData.profileImage,
                reason : 'commented In Your Video .... ',
            })
    
            await insertNotif.save()

            return res.status(200).json({
                message : 'success'
            })


        }else{
            return res.status(200).json({
                message : 'The Video Does Not Exist Anymore ...'
            })
        }
    }catch(err){
        throw err
    }
}

module.exports = AddNewComment