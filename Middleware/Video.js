const Multer = require('multer')

const storage3 = Multer.diskStorage({
    destination : (req, file, cb)=>{
        cb(null, 'public/videos')
    },
    filename : (req, file, cb)=>{
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const Video = Multer({storage : storage3})

module.exports = Video