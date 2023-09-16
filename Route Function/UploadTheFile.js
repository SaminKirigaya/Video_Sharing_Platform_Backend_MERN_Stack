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


        var title = req.body.Title
        var description = req.body.Description
        var tags = req.body.Tags

        console.log(tags, title, description)
        return res.status(200).json({
            message : 'Your file was successfully uploaded ...'
        })

    }catch(err){
        throw err
    }
}

module.exports = UploadTheFile