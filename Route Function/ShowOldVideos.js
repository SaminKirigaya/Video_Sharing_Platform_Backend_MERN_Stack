const UploadedVideos = require('../Model/UploadedVideos')

async function ShowOldVideos(req, res,next){
    try{
        const {usersl} = req.params
        const oldVideosData = await UploadedVideos.find({
            userSerial : usersl 
        }).sort({uploadingDate : -1})

        console.log(oldVideosData)
        if(oldVideosData){
            return res.status(200).json({
                message : 'success',
                oldVideos : oldVideosData
            })

        }else{
            return res.status(200).json({
                message : 'Failed'
            })

        }
    }catch(err){
        throw err 
    }
}

module.exports = ShowOldVideos