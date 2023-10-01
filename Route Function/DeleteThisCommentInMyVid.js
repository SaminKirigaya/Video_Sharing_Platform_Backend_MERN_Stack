const UploadedVideos = require('../Model/UploadedVideos')
const Comment = require('../Model/Comment')
const CommentLove = require('../Model/CommentLove')
const CommentDislove = require('../Model/CommentDislove')
const CommentNotification = require('../Model/CommentNotification')
const CommentReplay = require ('../Model/CommentReplay')
const ReplayLove = require('../Model/ReplayLove')
const ReplayDislove = require('../Model/ReplayDislove')
const ReplayNotification = require('../Model/ReplayNotification')


async function DeleteThisCommentInMyVid (req, res, next){
    try{
        const {usersl} = req.params 
        const {commentId} = req.body

        const isCommentExist = await Comment.findById(commentId)
        if(isCommentExist){
            const getVidDetail = await UploadedVideos.findById(isCommentExist.videoSerial)
            if(getVidDetail){
                if(getVidDetail.userSerial == usersl){
                    await  Comment.findByIdAndDelete(commentId) 
                    await CommentLove.deleteMany({commentSerial : commentId})
                    await CommentDislove.deleteMany({commentSerial : commentId})
                    await CommentNotification.deleteMany({commentSerial : commentId})
                    await CommentReplay.deleteMany({commentSerial: commentId})
                    await ReplayLove.deleteMany({commentSerial : commentId})
                    await ReplayDislove.deleteMany({commentSerial : commentId})
                    await ReplayNotification.deleteMany({commentSerial : commentId})

                    return res.status(200).json({
                        message : 'success'
                    })

                }else{
                    return res.status(200).json({
                        message : 'You are not the author of this comment\'s video ...'
                    })
                }
            }else{
                return res.status(200).json({
                    message : 'Video does not exist anymore ...'
                })
            }
        }else{
            return res.status(200).json({
                message : 'Failed'
            })
        }
    }catch(err){
        throw err
    }
}

module.exports = DeleteThisCommentInMyVid