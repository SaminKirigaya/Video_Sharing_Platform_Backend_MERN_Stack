const WatchList = require('../Model/WatchList')

async function AddThisToWatchList(req, res, next){
    try{
        const {usersl} = req.params
        const {videoSerial} = req.body 

        const alreadyThere = await WatchList.findOne({$and: [{userSerial: usersl},{videoId: videoSerial}]})

        if(alreadyThere){
            return res.status(200).json({
                message : "The video already exists in your watchlist ..."
            })
        }else{
            const addVideo = new WatchList({
                userSerial : usersl,
                videoId: videoSerial
            })

            await addVideo.save()

            return res.status(200).json({
                message : 'success'
            })
        }

    }catch(err){
        throw err
    }
}

module.exports = AddThisToWatchList