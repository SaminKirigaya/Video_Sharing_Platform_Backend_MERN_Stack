const UploadedVideos = require('../Model/UploadedVideos')
const fs = require('fs')
const path = require('path')

function generateFilename(){
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let otp = "";

    for (let i=0;i<=20;i++){
        let randomNumber = Math.floor(Math.random()*charset.length)
        otp += charset[randomNumber] 
    }

    return otp
}


async function UploadTheFile(req, res, next){
    try{
        const {usersl} = req.params
        const video = req.files['Video'][0].filename
        const thumbnail = req.files['Thumbnail'][0].filename

        const globalVideo = process.env.IMG+'/public/videos/'+video 
        const globalThumbnail = process.env.IMG+'/public/videos/'+thumbnail

        var title = req.body.Title
        var description = req.body.Description
        var tags = req.body.Tags


        
        const charactersToReplace = ['<', '>', '/', ';'];
        const replacementCharacters = ['&lt;', '&gt;', '&#47;', '&#59;'];
      
        for (let i = 0; i < charactersToReplace.length; i++) {
            const regex = new RegExp(charactersToReplace[i], 'g');
            title = title.replace(regex, replacementCharacters[i]);
            description = description.replace(regex, replacementCharacters[i]);
            tags = tags.replace(regex, replacementCharacters[i]);
        }

        const saveData = new UploadedVideos({
            userSerial : usersl,
            title : title,
            description : description,
            tags : tags,
            videoLink : globalVideo,
            thumbnailLink : globalThumbnail,
        })


        await saveData.save()

        return res.status(200).json({
            message : 'Your file was successfully uploaded ...'
        })

    }catch(err){
        throw err
    }
}

module.exports = UploadTheFile