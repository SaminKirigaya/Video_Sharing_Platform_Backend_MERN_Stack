const UploadedVideos = require('../Model/UploadedVideos')
const VerifiedUsers = require('../Model/VerifiedUsers')
const WatchList = require('../Model/WatchList')



async function GiveVideoesForWatchlist(req, res, next){
    const {userId} = req.body
    var finalIds = []
    try{
        const isrealUser = await  VerifiedUsers.findById(userId)
        if(!isrealUser){
            return res.status(200).json({
                message : 'Seems the user is not authenticated ...'
            })
        }
        const   getWatchList = await  WatchList.find({userSerial : userId}).sort({ added: -1 }).lean()
        var   videoIds = []

        if(getWatchList){
            if(getWatchList.length>1){
                await   Promise.all(
                    getWatchList.map((each)=>{
                        videoIds.push(each.videoId)
                    })
                )
            }else if(getWatchList[0]){
                
                    videoIds.push(getWatchList[0].videoId)
                
                
            }
        }else if (!getWatchList){
            return res.status(200).json({
                message : 'Seems like there are no bookmarked videos in the server for you ...'
            })
        }

        if(videoIds.length>1){
            
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

module.exports = GiveVideoesForWatchlist