const UploadedVideos = require('../Model/UploadedVideos')

async function SetNewDetailsInVideo(req, res, next){
    try{
        const {usersl} = req.params 


        var newTitl = req.body.newTitle 
        var newDesc = req.body.newDesc 
        var moreTags = req.body.tags
        var videoSl = req.body.videoSl


        const video = await UploadedVideos.findById(videoSl)
        if(video.userSerial == usersl){
            const charactersToReplace = ['<', '>', '/', ';'];
            const replacementCharacters = ['&lt;', '&gt;', '&#47;', '&#59;'];
        
            for (let i = 0; i < charactersToReplace.length; i++) {
                const regex = new RegExp(charactersToReplace[i], 'g');
                newTitl = newTitl.replace(regex, replacementCharacters[i]);
                newDesc = newDesc.replace(regex, replacementCharacters[i]);
                moreTags = moreTags.replace(regex, replacementCharacters[i]);
            }

            var newTag = video.tags+','+moreTags

            await UploadedVideos.findByIdAndUpdate(videoSl,{$set: {
                title : newTitl,
                description : newDesc,
                tags : newTag,
            }})
            
            return res.status(200).json({
                message : 'success'
            })
        }else{
            return res.status(200).json({
                message : 'You are not the author of this video ...'
            })
        }



    }catch(err){
        throw err
    }
}

module.exports = SetNewDetailsInVideo