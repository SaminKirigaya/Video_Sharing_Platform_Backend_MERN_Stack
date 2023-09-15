const VerifiedUsers = require('../Model/VerifiedUsers')
const joi = require('joi')
const jimp = require('jimp')
const path = require('path')
const fs = require('fs')

const schema = joi.object({
    Username : joi.string().pattern(/^([0-9a-zA-Z_]+)$/).required().error(new Error('Username must only contain 0-9, a-z, A-Z or _')),
    Fullname : joi.string().pattern(/^([a-zA-Z ]+)$/).required().error(new Error('Full name can only contain a-z, A-Z or space.')),
    Gender : joi.string().required(),
    Country : joi.string().required(),
    Address : joi.string().pattern(/^([0-9a-zA-Z-,\/ ]+)$/).required().error(new Error('Address can only have 0-9, a-z, A-Z,-,/ and ,')),
    Birth_Date : joi.date().required(),

})


async function SetProfileDataBothImg(req, res, next){
    try{
        const {error} = schema.validate(req.body)
        if(error){
            return res.status(200).json({
                message : error.message
            })
        }


        const {usersl} = req.params 

        const userData = await VerifiedUsers.findById(usersl).lean()



        const filename1 = userData.profileImage.split('/');
        const size1 = filename1.length;
        const lastElement1 = filename1[size1 - 1];

        const profPath = `public/images/${lastElement1}`;
        fs.unlinkSync(profPath);

        const filename2 = userData.coverImage.split('/');
        const size2 = filename2.length;
        const lastElement2 = filename2[size2 - 1];

        const coverPath = `public/images/${lastElement2}`;
        fs.unlinkSync(coverPath);



        // set both images
        const profile_image = req.files['ProfileImage'][0] 
        const cover_image = req.files['CoverImage'][0]

        const profileImagePath = path.join('public/images', profile_image.filename)
        const readIt = await jimp.read(profile_image.path)
        await readIt.resize(100, 100).quality(80).writeAsync(profileImagePath) // change resolution

        const globalProfileImage = `${process.env.IMG}/public/images/${profile_image.filename}`; 
        const globalCoverImage = `${process.env.IMG}/public/images/${cover_image.filename}`;

        await VerifiedUsers.findByIdAndUpdate(usersl,{$set: {
            username : req.body.Username,
            fullName : req.body.Fullname,
            gender : req.body.Gender,
            country : req.body.Country,
            address : req.body.Address,
            dateOfBirth : req.body.Birth_Date,
            profileImage : globalProfileImage,
            coverImage : globalCoverImage,
        }})

        return res.status(200).json({
            message : 'Successfully new user informtation was set in server. Please log in again ...'
        })

    }catch(err){
        throw err
    }
}

module.exports = SetProfileDataBothImg