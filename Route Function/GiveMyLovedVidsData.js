const UploadedVideos = require('../Model/UploadedVideos')
const VerifiedUsers = require('../Model/VerifiedUsers')
const LoveReact = require('../Model/LoveReact')



async function GiveMyLovedVidsData(req, res, next){
    const {userId} = req.body
    var finalIds = []
    try{
        const isrealUser = await  VerifiedUsers.findById(userId)
        if(!isrealUser){
            return res.status(200).json({
                message : 'Seems the user is not authenticated ...'
            })
        }
        const   lovedReactedVids = await  LoveReact.find({whoGivingSerial : userId}).sort({ added: -1 }).lean()
        var   videoIds = []

        if(lovedReactedVids){
            if(lovedReactedVids.length>1){
                await   Promise.all(
                    lovedReactedVids.map((each)=>{
                        videoIds.push(each.videoSerial)
                    })
                )
            }else if(lovedReactedVids[0]){
                
                    videoIds.push(lovedReactedVids[0].videoSerial)
                
                
            }
        }else if (!lovedReactedVids){
            return res.status(200).json({
                message : 'Seems like there are no bookmarked videos in the server for you ...'
            })
        }

        if(videoIds.length>0 && videoIds){
            
            for(let i=videoIds.length-1; i>=0; i--){
                finalIds.push(videoIds[i])
            }
            
        }

        var allVideos = await UploadedVideos.find({_id:{$in:finalIds}}).lean()
        if(allVideos){
            var randomVideos = allVideos
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
            return res.status(200).json({
                message : 'Seems like there are no videos in the server ...'
            })
        }
    }catch(err){
        throw err
    }
}

module.exports = GiveMyLovedVidsData