const LoveReact = require('../Model/LoveReact')
const DisLoveReact = require('../Model/DisLoveReact')
const Notification = require('../Model/Notification')
const UploadedVideos = require('../Model/UploadedVideos')
const WatchList = require('../Model/WatchList')
const Report = require('../Model/Report')



async function ReportThisVideo(req, res, next){
    try{
        const {usersl} = req.params 
        const {videoSl} = req.body 

        const isVideoExist = await UploadedVideos.findById(videoSl)
        if(!isVideoExist){
            return res.status(200).json({
                message : 'Video does not exist ...'
            })
        }

        const alreadyReported = await Report.findOne({$and : [{videoSerial: videoSl},{reportedBy: usersl}]})
        if(alreadyReported){
            return res.status(200).json({
                message : 'Already reported ...'
            })
        }else{
            const totalReports = await Report.find({videoSerial: videoSl}).lean()
            if(totalReports.length>29){
                
                await UploadedVideos.findByIdAndDelete(videoSl) // deleting video from upload database
                await WatchList.deleteMany({videoId : videoSl}) //anyone who addded it in their watchlist will no longer find it
                await LoveReact.deleteMany({videoSerial: videoSl}) // deleting from love react db table
                await DisLoveReact.deleteMany({videoSerial: videoSl}) // deleting from dislove react db table
                await Notification.deleteMany({videoSerial: videoSl}) // delete video serial from notification db table 

                return res.status(200).json({
                    message : 'success'
                })

            }else{
                const newReport = new Report({
                    videoSerial : videoSl,
                    reportedBy: usersl,
                })

                await newReport.save()

                return res.status(200).json({
                    message : 'success'
                })
            }

        }

    }catch(err){
        throw err
    }
}

module.exports = ReportThisVideo