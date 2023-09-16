const Multer = require('multer')

const storage1 = Multer.diskStorage({
    destination : (req, file, cb)=>{
        cb(null, 'public/images')
    },
    filename : (req, file, cb)=>{
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = Multer({storage : storage1})

module.exports = upload