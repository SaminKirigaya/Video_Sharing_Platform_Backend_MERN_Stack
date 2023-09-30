const VerifiedUsers = require('../Model/VerifiedUsers')
const LoveReact = require('../Model/LoveReact')
const DisLoveReact = require('../Model/DisLoveReact')

const UploadedVideos = require('../Model/UploadedVideos')
const Notification = require('../Model/Notification')

async function GiveLoveReact(req, res, next){
 try{
    const {usersl} = req.params 
    const {videoSl} = req.body 

    const isAlreadyLoved = await LoveReact.findOne({$and : [{videoSerial: videoSl},{whoGivingSerial: usersl}]})
    if(isAlreadyLoved){
        return res.status(200).json({
            message : 'Failed'
        })
    }

    const uploadedVid = await UploadedVideos.findById(videoSl)
    const whoSendingData = await VerifiedUsers.findById(usersl)

    const isInDisloved = await DisLoveReact.findOne({$and : [{videoSerial: videoSl},{whoGivingSerial: usersl}]})

    if(!isAlreadyLoved && isInDisloved){
        await DisLoveReact.findOneAndDelete({$and : [{videoSerial: videoSl},{whoGivingSerial: usersl}]})

        const newAddLove = new LoveReact({
            videoSerial : videoSl,
            whoGivingSerial : usersl,
            whosePostSerial : uploadedVid.userSerial,
            whoGivingUsername: whoSendingData.username,
            whoGivingImage : whoSendingData.profileImage,
        })
        await newAddLove.save()

        var oldLike = uploadedVid.likeamount
        var oldDisLike = uploadedVid.dislikedamount

        oldDisLike = oldDisLike-1
        oldLike = oldLike+1
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
            reason : 'Loved Your Video .... That\'s Amazingggg !!!',
        })

        await insertNotif.save()

        return res.status(200).json({
            message : 'success'
        })

    }

    if(!isAlreadyLoved && !isInDisloved){
        const newAddLove = new LoveReact({
            videoSerial : videoSl,
            whoGivingSerial : usersl,
            whosePostSerial : uploadedVid.userSerial,
            whoGivingUsername: whoSendingData.username,
            whoGivingImage : whoSendingData.profileImage,
        })
        await newAddLove.save()

        var oldLike = uploadedVid.likeamount
        oldLike = oldLike+1

        await UploadedVideos.findByIdAndUpdate(videoSl,{
            $set : {
                likeamount : oldLike,
                
            }
        })

        const insertNotif = new Notification({
            videoSerial : videoSl,
            whoGivingSerial : usersl,
            whoGivingUsername : whoSendingData.username,
            whosePostSerial: uploadedVid.userSerial,
            whoGivingImage : whoSendingData.profileImage,
            reason : 'Loved Your Video .... That\'s Amazingggg !!!',
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

module.exports = GiveLoveReact