const VerifiedUsers = require('../Model/VerifiedUsers')
const CommentLove = require('../Model/CommentLove')
const CommentDislove = require('../Model/CommentDislove')
const Comment = require('../Model/Comment')

const CommentNotification = require('../Model/CommentNotification')

async function GivingLoveToAComment(req, res, next){
 try{
    const {usersl} = req.params 
    const {commentid, videoSl} = req.body 

    const isAlreadyLoved = await CommentLove.findOne({$and : [{commentSerial: commentid},{whoGivingSerial: usersl}]})
    if(isAlreadyLoved){
        return res.status(200).json({
            message : 'Failed'
        })
    }

    const uploadedComment = await Comment.findById(commentid)
    const whoSendingData = await VerifiedUsers.findById(usersl)

    const isInDisloved = await CommentDislove.findOne({$and : [{commentSerial: commentid},{whoGivingSerial: usersl}]})

    if(!isAlreadyLoved && isInDisloved){
        await CommentDislove.findOneAndDelete({$and : [{commentSerial: commentid},{whoGivingSerial: usersl}]})

        const newAddLove = new CommentLove({
            videoSerial : videoSl,
            commentSerial: commentid,
            whoGivingSerial : usersl,
            whosePostSerial : uploadedComment.whoGivingSerial,
            whoGivingUsername: whoSendingData.username,
            whoGivingImage : whoSendingData.profileImage,
        })
        await newAddLove.save()

        var oldLike = uploadedComment.commentLove
        var oldDisLike = uploadedComment.commentDislove

        oldDisLike = oldDisLike-1
        oldLike = oldLike+1
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
            reason : 'Loved Your Comment .... That\'s Amazingggg !!!',
        })

        await insertNotif.save()

        return res.status(200).json({
            message : 'success'
        })

    }

    if(!isAlreadyLoved && !isInDisloved){
        const newAddLove = new CommentLove({
            videoSerial : videoSl,
            commentSerial: commentid,
            whoGivingSerial : usersl,
            whosePostSerial : uploadedComment.whoGivingSerial,
            whoGivingUsername: whoSendingData.username,
            whoGivingImage : whoSendingData.profileImage,
        })
        await newAddLove.save()

        var oldLike = uploadedComment.commentLove
        oldLike = oldLike+1

        await Comment.findByIdAndUpdate(commentid,{
            $set : {
                commentLove : oldLike,
                
            }
        })

        const insertNotif = new CommentNotification({
            videoSerial : videoSl,
            commentSerial: commentid,
            whoGivingSerial : usersl,
            whoGivingUsername : whoSendingData.username,
            whoseCommentSerial : uploadedComment.whoGivingSerial,
            whoGivingImage : whoSendingData.profileImage,
            reason : 'Loved Your Comment .... That\'s Amazingggg !!!',
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

module.exports = GivingLoveToAComment