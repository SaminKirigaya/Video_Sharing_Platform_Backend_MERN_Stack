const UploadedVideos = require('../Model/UploadedVideos')
const VerifiedUsers = require('../Model/VerifiedUsers')

async function GettingHomePageVideos(req, res, next){

    try{
        var randomVideos = await UploadedVideos.find({}).lean()
        if(randomVideos){
            await Promise.all(
                randomVideos.map(async (each)=>{
                    var userData = await VerifiedUsers.findById(each.userSerial).lean()
                    each.playerAvatar = userData.profileImage
                    each.username = userData.username
                })
            )

            return res.status(200).json({
                message : 'success',
                oldVideos : randomVideos
            })
        }else{
            return res.status(200).jaon({
                message : 'Seems like there are no videos in the server ...'
            })
        }
    }catch(err){
        throw err
    }
}

module.exports = GettingHomePageVideos