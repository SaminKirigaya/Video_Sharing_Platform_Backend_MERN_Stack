const VerifiedUsers = require('../Model/VerifiedUsers')
const ReplayLove = require('../Model/ReplayLove')
const ReplayDislove = require('../Model/ReplayDislove')
const CommentReplay = require('../Model/CommentReplay')

const ReplayNotification = require('../Model/ReplayNotification')

async function GivingLoveToReplay(req, res, next){
 try{
    const {usersl} = req.params 
    const {replayid, videoSl} = req.body 

    const isAlreadyLoved = await  ReplayLove.findOne({$and : [{replaySerial: replayid},{whoGivingSerial: usersl}]})
    if(isAlreadyLoved){
        return res.status(200).json({
            message : 'Failed'
        })
    }

    const uploadedReplay = await CommentReplay.findById(replayid)
    const whoSendingData = await VerifiedUsers.findById(usersl)

    const isInDisloved = await ReplayDislove.findOne({$and : [{replaySerial: replayid},{whoGivingSerial: usersl}]})

    if(!isAlreadyLoved && isInDisloved){
        await ReplayDislove.findOneAndDelete({$and : [{replaySerial: replayid},{whoGivingSerial: usersl}]})

        const newAddLove = new ReplayLove({
            videoSerial : videoSl,
            replaySerial: replayid,
            commentSerial: uploadedReplay.commentSerial,
            whoGivingSerial : usersl,
            whoseReplaySerial : uploadedReplay.whoGivingSerial,
            whoGivingUsername: whoSendingData.username,
            whoGivingImage : whoSendingData.profileImage,
        })
        await newAddLove.save()

        var oldLike = uploadedReplay.replayLove
        var oldDisLike = uploadedReplay.replayDislove

        oldDisLike = oldDisLike-1
        oldLike = oldLike+1
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
            reason : 'Loved Your Replay .... That\'s Amazingggg !!!',
        })

        await insertNotif.save()

        return res.status(200).json({
            message : 'success'
        })

    }

    if(!isAlreadyLoved && !isInDisloved){
        const newAddLove = new ReplayLove({
            videoSerial : videoSl,
            replaySerial: replayid,
            commentSerial: uploadedReplay.commentSerial,
            whoGivingSerial : usersl,
            whoseReplaySerial : uploadedReplay.whoGivingSerial,
            whoGivingUsername: whoSendingData.username,
            whoGivingImage : whoSendingData.profileImage,
        })
        await newAddLove.save()

        var oldLike = uploadedReplay.replayLove
        oldLike = oldLike+1

        await CommentReplay.findByIdAndUpdate(replayid,{
            $set : {
                replayLove : oldLike,
                
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
            reason : 'Loved Your Replay .... That\'s Amazingggg !!!',
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

module.exports = GivingLoveToReplay