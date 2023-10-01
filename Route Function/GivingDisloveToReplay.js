const VerifiedUsers = require('../Model/VerifiedUsers')
const ReplayLove = require('../Model/ReplayLove')
const ReplayDislove = require('../Model/ReplayDislove')
const CommentReplay = require('../Model/CommentReplay')

const ReplayNotification = require('../Model/ReplayNotification')

async function GivingDisloveToReplay(req, res, next){
 try{
    const {usersl} = req.params 
    const {replayid, videoSl} = req.body 

    const isAlreadyDisloved = await  ReplayDislove.findOne({$and : [{replaySerial: replayid},{whoGivingSerial: usersl}]})
    if(isAlreadyDisloved){
        return res.status(200).json({
            message : 'Failed'
        })
    }

    const uploadedReplay = await CommentReplay.findById(replayid)
    const whoSendingData = await VerifiedUsers.findById(usersl)

    const isInLoved = await ReplayLove.findOne({$and : [{replaySerial: replayid},{whoGivingSerial: usersl}]})

    if(!isAlreadyDisloved && isInLoved){
        await ReplayLove.findOneAndDelete({$and : [{replaySerial: replayid},{whoGivingSerial: usersl}]})

        const newAddDislove = new ReplayDislove({
            videoSerial : videoSl,
            replaySerial: replayid,
            commentSerial: uploadedReplay.commentSerial,
            whoGivingSerial : usersl,
            whoseReplaySerial : uploadedReplay.whoGivingSerial,
            whoGivingUsername: whoSendingData.username,
            whoGivingImage : whoSendingData.profileImage,
        })
        await newAddDislove.save()

        var oldLike = uploadedReplay.replayLove
        var oldDisLike = uploadedReplay.replayDislove

        oldDisLike = oldDisLike+1
        oldLike = oldLike-1
        await CommentReplay.findByIdAndUpdate(replayid,{
            $set : {
                replayLove : oldLike,
                replayDislove : oldDisLike,
            }
        })

        const insertNotif = new ReplayNotification({
            videoSerial : videoSl,
            replaySerial: replayid,
            commentSerial: uploadedReplay.commentSerial,
            whoGivingSerial : usersl,
            whoGivingUsername : whoSendingData.username,
            whoseReplaySerial : uploadedReplay.whoGivingSerial,
            whoGivingImage : whoSendingData.profileImage,
            reason : 'Hated Your Replay .... That\'s Sad !!!',
        })

        await insertNotif.save()

        return res.status(200).json({
            message : 'success'
        })

    }

    if(!isAlreadyDisloved && !isInLoved){
        const newAddDislove = new ReplayDislove({
            videoSerial : videoSl,
            replaySerial: replayid,
            commentSerial: uploadedReplay.commentSerial,
            whoGivingSerial : usersl,
            whoseReplaySerial : uploadedReplay.whoGivingSerial,
            whoGivingUsername: whoSendingData.username,
            whoGivingImage : whoSendingData.profileImage,
        })
        await newAddDislove.save()

        var oldDislove = uploadedReplay.replayDislove
        oldDislove = oldDislove+1

        await CommentReplay.findByIdAndUpdate(replayid,{
            $set : {
                replayDislove : oldDislove,
                
            }
        })

        const insertNotif = new ReplayNotification({
            videoSerial : videoSl,
            replaySerial: replayid,
            commentSerial: uploadedReplay.commentSerial,
            whoGivingSerial : usersl,
            whoGivingUsername : whoSendingData.username,
            whoseReplaySerial : uploadedReplay.whoGivingSerial,
            whoGivingImage : whoSendingData.profileImage,
            reason : 'Hated Your Replay .... That\'s Sad !!!',
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

module.exports = GivingDisloveToReplay