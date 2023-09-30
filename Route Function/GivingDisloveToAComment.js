const VerifiedUsers = require('../Model/VerifiedUsers')
const CommentLove = require('../Model/CommentLove')
const CommentDislove = require('../Model/CommentDislove')
const Comment = require('../Model/Comment')

const CommentNotification = require('../Model/CommentNotification')

async function GivingDisloveToAComment(req, res, next){
 try{
    const {usersl} = req.params 
    const {commentid, videoSl} = req.body 

    const isAlreadyDisloved = await CommentDislove.findOne({$and : [{commentSerial: commentid},{whoGivingSerial: usersl}]})
    if(isAlreadyDisloved){
        return res.status(200).json({
            message : 'Failed'
        })
    }

    const uploadedComment = await Comment.findById(commentid)
    const whoSendingData = await VerifiedUsers.findById(usersl)

    const isInLoved = await CommentLove.findOne({$and : [{commentSerial: commentid},{whoGivingSerial: usersl}]})

    if(!isAlreadyDisloved && isInLoved){
        await CommentLove.findOneAndDelete({$and : [{commentSerial: commentid},{whoGivingSerial: usersl}]})

        const newAddDislove = new CommentDislove({
            videoSerial : videoSl,
            commentSerial: commentid,
            whoGivingSerial : usersl,
            whosePostSerial : uploadedComment.whoGivingSerial,
            whoGivingUsername: whoSendingData.username,
            whoGivingImage : whoSendingData.profileImage,
        })
        await newAddDislove.save()

        var oldLike = uploadedComment.commentLove
        var oldDisLike = uploadedComment.commentDislove

        oldDisLike = oldDisLike+1
        oldLike = oldLike-1
        await Comment.findByIdAndUpdate(commentid,{
            $set : {
                commentLove : oldLike,
                commentDislove : oldDisLike,
            }
        })

        const insertNotif = new CommentNotification({
            videoSerial : videoSl,
            commentSerial: commentid,
            whoGivingSerial : usersl,
            whoGivingUsername : whoSendingData.username,
            whoseCommentSerial : uploadedComment.whoGivingSerial,
            whoGivingImage : whoSendingData.profileImage,
            reason : 'Hates Your Comment .... That\'s Sad !!!',
        })

        await insertNotif.save()

        return res.status(200).json({
            message : 'success'
        })

    }

    if(!isAlreadyDisloved && !isInLoved){
        const newAddDislove = new CommentDislove({
            videoSerial : videoSl,
            commentSerial: commentid,
            whoGivingSerial : usersl,
            whosePostSerial : uploadedComment.whoGivingSerial,
            whoGivingUsername: whoSendingData.username,
            whoGivingImage : whoSendingData.profileImage,
        })
        await newAddDislove.save()

        var oldDislike = uploadedComment.commentDislove
        oldDislike = oldDislike+1

        await Comment.findByIdAndUpdate(commentid,{
            $set : {
                commentDislove : oldDislike,
                
            }
        })

        const insertNotif = new CommentNotification({
            videoSerial : videoSl,
            commentSerial: commentid,
            whoGivingSerial : usersl,
            whoGivingUsername : whoSendingData.username,
            whoseCommentSerial : uploadedComment.whoGivingSerial,
            whoGivingImage : whoSendingData.profileImage,
            reason : 'Hates Your Comment .... That\'s Sad !!!',
        })

        await insertNotif.save()

        return res.status(200).json({
            message : 'success'
        })


    }

 }catch(err){
    throw err
 }
}

module.exports = GivingDisloveToAComment