const Multer = require('multer')

const storage = Multer.diskStorage({
    destination : (req, file, cb)=>{
        cb(null, 'public/videos')
    },
    filename : (req, file, cb)=>{
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const Video = Multer({storage})

module.exports = Video