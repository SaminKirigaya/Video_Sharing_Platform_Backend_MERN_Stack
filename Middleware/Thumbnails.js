const Multer = require('multer')

const storage = Multer.diskStorage({
    destination : (req, file, cb)=>{
        cb(null, 'public/thumbnails')
    },
    filename : (req, file, cb)=>{
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const Thumbnails = Multer({storage})

module.exports = Thumbnails