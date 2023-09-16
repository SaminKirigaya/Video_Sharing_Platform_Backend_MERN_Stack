const Multer = require('multer')

const storage2 = Multer.diskStorage({
    destination : (req, file, cb)=>{
        cb(null, 'public/thumbnails')
    },
    filename : (req, file, cb)=>{
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const Thumbnails = Multer({storage : storage2})

module.exports = Thumbnails