const UploadedVideos = require('../Model/UploadedVideos')

const CommentReplay = require ('../Model/CommentReplay')
const ReplayLove = require('../Model/ReplayLove')
const ReplayDislove = require('../Model/ReplayDislove')
const ReplayNotification = require('../Model/ReplayNotification')


async function DeleteThisReplayInMyVid (req, res, next){
    try{
        const {usersl} = req.params 
        const {replayId} = req.body

        const isReplayExist = await CommentReplay.findById(replayId)
        if(isReplayExist){
            const getVidDetail = await UploadedVideos.findById(isReplayExist.videoSerial)
            if(getVidDetail){
                if(getVidDetail.userSerial == usersl){
                    
                    await CommentReplay.findByIdAndDelete(replayId)
                    await ReplayLove.deleteMany({replaySerial : replayId})
                    await ReplayDislove.deleteMany({replaySerial : replayId})
                    await ReplayNotification.deleteMany({replaySerial : replayId})

                    return res.status(200).json({
                        message : 'success'
                    })

                }else{
                    return res.status(200).json({
                        message : 'You are not the author of this reply\'s video ...'
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

module.exports = DeleteThisReplayInMyVid