const UploadedVideos = require('../Model/UploadedVideos')
const VerifiedUsers = require('../Model/VerifiedUsers')

// Function to shuffle an array using Fisher-Yates algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array
  }

async function SearchDataOfAUsername(req, res, next){
    const {searchText} = req.body
    var allUserSerials = []
    try{
        const userData = await VerifiedUsers.find({$text : {$search : searchText}})
        if(userData.length>1){
            await Promise.all(
            userData.map((each)=>{
                allUserSerials.push(each._id)
            })
            )
        }else if(userData[0]){
            
            allUserSerials.push(userData[0]._id)
            
        }
        

        if(allUserSerials.length>1){
            var allVideos = await UploadedVideos.find({userSerial : {$in : allUserSerials}}).lean()
        }else if(allUserSerials[0]){
            var allVideos = await UploadedVideos.find({userSerial : allUserSerials[0]}).lean()
        }
        
        if(allVideos){
            var randomVideos = shuffleArray(allVideos)
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

module.exports = SearchDataOfAUsername