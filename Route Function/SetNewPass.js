const VerifiedUsers = require('../Model/VerifiedUsers')
const ForgotPass = require('../Model/ForgotPass')
const bcrypt = require('bcrypt')
const joi = require('joi')


const schema = joi.object({
    OldPassword : joi.string().pattern(/^([0-9a-zA-Z@!_]+){6,50}$/).required().error(new Error('Old Password can only contain 0-9, a-z, A-Z, @, !, _ also it must never have space and it must be from 6-50 characters.')),
    NewPassword : joi.string().pattern(/^([0-9a-zA-Z@!_]+){6,50}$/).required().error(new Error('New Password can only contain 0-9, a-z, A-Z, @, !, _ also it must never have space and it must be from 6-50 characters.')),
})


async function SetNewPass(req, res, next){
    try{

        const {error} = schema.validate(req.body)
        if(error){
            return res.status(200).json({
                message : error.message
            })
        }

        const {usersl} = req.params 

        const userData = await VerifiedUsers.findById(usersl)

        if(userData){
            const passMatch1 = await bcrypt.compare(req.body.OldPassword, userData.password)

            const inForgotDb = await ForgotPass.findOne({email : userData.email})

            const passMatch2 = await bcrypt.compare(req.body.OldPassword, inForgotDb.password)

            if(passMatch1 || passMatch2){

                const newPass = await bcrypt.hash(req.body.NewPassword, 10)

                await VerifiedUsers.findByIdAndUpdate(usersl,{$set : {
                    password : newPass
                }})

                await ForgotPass.findOneAndUpdate({email : userData.email},{$set: {
                    password : newPass
                }})

                return res.status(200).json({
                    message : 'Successfully changed the password ... Please log in again .'
                })

            }else{
                return res.status(200).json({
                    message : 'The old password you provided doesn\'t match with the new password ...'
                })
            }

        }else{
            return res.status(200).json({
                message : 'Sorry seems there\'s no such user exist with this user data.'
            })
        }
        
    }catch(err){
        throw err
    }
}

module.exports = SetNewPass