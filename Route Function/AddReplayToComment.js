const Comment = require('../Model/Comment')
const CommentReplay = require('../Model/CommentReplay')
const CommentNotification = require('../Model/CommentNotification')
const UploadedVideos = require('../Model/UploadedVideos')
const VerifiedUsers = require('../Model/VerifiedUsers')

async function AddReplayToComment(req, res, next){
    try{
        const {usersl} = req.params 
        var {commentid, replay, videoSl} = req.body

        const videoExist = await UploadedVideos.findById(videoSl)
        if(videoExist){
            const commentExist = await Comment.findById(commentid) 
            if(commentExist){
                const userData = await VerifiedUsers.findById(usersl)
                
                var replacable = ["<",">","/",";"]
                var replaceWith = ["&lt;", "&gt;", "&#47;", "&#59;"]
                for (let i=0 ; i<replacable.length; i++){
                    var regex = new RegExp(replacable[i],'g')
                    replay = replay.replace(regex, replaceWith[i])
                }

                const addReplay = new CommentReplay({
                    videoSerial: videoSl,
                    commentSerial: commentid,
                    whoGivingSerial: usersl,
                    whoGivingUsername: userData.username,
                    whoGivingImage: userData.profileImage,
                    whoseCommentSerial: commentExist.whoGivingSerial,
                    replay: replay,
                    replayLove: 0,
                    replayDislove: 0,

                })
                await  addReplay.save()

                const addNotifInCommenter = new CommentNotification({
                    videoSerial : videoSl,
                    commentSerial: commentid,
                    whoGivingSerial: usersl,
                    whoGivingUsername: userData.username,
                    whoGivingImage: userData.profileImage, 
                    whoseCommentSerial: commentExist.whoGivingSerial,
                    reason : 'Commented in your comment ...'
                })

                await addNotifInCommenter.save()

                return res.status(200).json({
                    message : 'success'
                })

            }else{
                return res.status(200).json({
                    message : 'No such post exists ...'
                })
            }
        }else{
            return res.status(200).json({
                message : 'No such post exists ...'
            })
        }
    }catch(err){
        throw err
    }

}

module.exports = AddReplayToComment