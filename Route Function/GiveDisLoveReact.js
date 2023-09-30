const VerifiedUsers = require('../Model/VerifiedUsers')
const LoveReact = require('../Model/LoveReact')
const DisLoveReact = require('../Model/DisLoveReact')

const UploadedVideos = require('../Model/UploadedVideos')
const Notification = require('../Model/Notification')

async function GiveDisLoveReact(req, res, next){
 try{
    const {usersl} = req.params 
    const {videoSl} = req.body 

    const isAlreadyDisLoved = await DisLoveReact.findOne({$and : [{videoSerial: videoSl},{whoGivingSerial: usersl}]})
    if(isAlreadyDisLoved){
        return res.status(200).json({
            message : 'Failed'
        })
    }

    const uploadedVid = await UploadedVideos.findById(videoSl)
    const whoSendingData = await VerifiedUsers.findById(usersl)

    const isInLoved = await LoveReact.findOne({$and : [{videoSerial: videoSl},{whoGivingSerial: usersl}]})
    
    if(!isAlreadyDisLoved && isInLoved){ 
        await LoveReact.findOneAndDelete({$and : [{videoSerial: videoSl},{whoGivingSerial: usersl}]})

        const newAddDisLove = new DisLoveReact({
            videoSerial : videoSl,
            whoGivingSerial : usersl,
            whosePostSerial : uploadedVid.userSerial,
            whoGivingUsername: whoSendingData.username,
            whoGivingImage : whoSendingData.profileImage,
        })
        await newAddDisLove.save()

        var oldLike = uploadedVid.likeamount
        var oldDisLike = uploadedVid.dislikedamount

        oldDisLike = oldDisLike+1
        oldLike = oldLike-1

        await UploadedVideos.findByIdAndUpdate(videoSl,{
            $set : {
                likeamount : oldLike,
                dislikedamount : oldDisLike,
            }
        })

        const insertNotif = new Notification({
            videoSerial : videoSl,
            whoGivingSerial : usersl,
            whoGivingUsername : whoSendingData.username,
            whosePostSerial: uploadedVid.userSerial,
            whoGivingImage : whoSendingData.profileImage,
            reason : 'Hated Your Video .... That\'s Sad.',
        })

        await insertNotif.save()

        return res.status(200).json({
            message : 'success'
        })

    }

    if(!isAlreadyDisLoved && !isInLoved){
        const newAddDisLove = new DisLoveReact({
            videoSerial : videoSl,
            whoGivingSerial : usersl,
            whosePostSerial : uploadedVid.userSerial,
            whoGivingUsername: whoSendingData.username,
            whoGivingImage : whoSendingData.profileImage,
        })
        await newAddDisLove.save()

        var oldDisLike = uploadedVid.dislikedamount 
        oldDisLike = oldDisLike+1

        await UploadedVideos.findByIdAndUpdate(videoSl,{
            $set : {
                dislikedamount : oldDisLike,
                
            }
        })

        const insertNotif = new Notification({
            videoSerial : videoSl,
            whoGivingSerial : usersl,
            whoGivingUsername : whoSendingData.username,
            whosePostSerial: uploadedVid.userSerial,
            whoGivingImage : whoSendingData.profileImage,
            reason : 'Hated Your Video .... That\'s Sad.',
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

module.exports = GiveDisLoveReact