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
        const video = req.files['Video']
        const thumbnail = req.files['Thumbnail']


        const uniqueFilename =  generateFilename(); // Implement a function to generate a unique filename
          const videoPath = `public/videos/${uniqueFilename}.mp4`; // Adjust the file extension as needed
          const serverVideoPath = `http://localhost:8000/public/videos/${uniqueFilename}.mp4`  // save in database
          fs.writeFile(videoPath, Buffer.from(video), (err) => {
              if (err) {
                console.error('Error writing image:', err);
                // Handle the error
              } else {
                console.log('Video saved successfully.');
                // Perform any additional actions
              }});


        const uniqueThumbnailname = generateFilename()
        const thumbnailPath = `public/thumbnails/${uniqueThumbnailname}.jpg`
        const serverThumbnailPath = `http://localhost:8000/public/thumbnails/${uniqueThumbnailname}.jpg`
        fs.writeFile(thumbnailPath, Buffer.from(thumbnail), (err) => {
            if (err) {
              console.error('Error writing image:', err);
              // Handle the error
            } else {
              console.log('Thumbnail saved successfully.');
              // Perform any additional actions
            }});

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