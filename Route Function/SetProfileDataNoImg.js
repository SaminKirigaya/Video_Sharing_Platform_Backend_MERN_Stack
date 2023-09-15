const VerifiedUsers = require('../Model/VerifiedUsers')
const joi = require('joi')

const schema = joi.object({
    Username : joi.string().pattern(/^([0-9a-zA-Z_]+)$/).required().error(new Error('Username must only contain 0-9, a-z, A-Z or _')),
    Fullname : joi.string().pattern(/^([a-zA-Z ]+)$/).required().error(new Error('Full name can only contain a-z, A-Z or space.')),
    Gender : joi.string().required(),
    Country : joi.string().required(),
    Address : joi.string().pattern(/^([0-9a-zA-Z-,\/ ]+)$/).required().error(new Error('Address can only have 0-9, a-z, A-Z,-,/ and ,')),
    Birth_Date : joi.date().required(),

})


async function SetProfileDataNoImg(req, res, next){
    try{
        const {error} = schema.validate(req.body)
        if(error){
            return res.status(200).json({
                message : error.message
            })
        }

        const {usersl} = req.params 
        await VerifiedUsers.findByIdAndUpdate(usersl,{$set: {
            username : req.body.Username,
            fullName : req.body.Fullname,
            gender : req.body.Gender,
            country : req.body.Country,
            address : req.body.Address,
            dateOfBirth : req.body.Birth_Date,
        }})

        return res.status(200).json({
            message : 'Successfully new user informtation was set in server. Please log in again ...'
        })

    }catch(err){
        throw err
    }
}

module.exports = SetProfileDataNoImg