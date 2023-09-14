const VerifiedUsers = require('../Model/VerifiedUsers')
const ForgotPass = require('../Model/ForgotPass')
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')



function generatePassword(){
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let otp = "";

    for (let i=0;i<=10;i++){
        let randomNumber = Math.floor(Math.random()*charset.length)
        otp += charset[randomNumber] 
    }

    return otp
}


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASS,
    }
})


async function ForgotPassword(req, res, next){
    try{
        const {Email} = req.body 
        const emailExist = await VerifiedUsers.findOne({email : Email})
        if(emailExist){
            const newPass = generatePassword()
            const hashedForm = await bcrypt.hash(newPass, 10)

            const updateOld = await ForgotPass.findOneAndUpdate({email : Email},{$set : {password : hashedForm}})
            const newMail = {
                from : 'VideoHubBD',
                to : `${Email}`,
                subject : 'A new alternative password.',
                text : `Your new alternative password is "${newPass}" with it you can log in your profile. In profile menu you can change your password. If you didn\'t apply for this just ignore this message and keep enjoying videos.`
            }


            transporter.sendMail(newMail, async(error, info)=>{
                if(error){
                    return res.status(200).json({
                        message : 'Some Error Occured.'
                    })
                }else{
                    
                    return res.status(200).json({
                        message : 'You were sent a new password in your mail, now you can login with that and change password in your profile.'
                    })
                }
            })


        }else{
            return res.status(200).json({
                message : 'Sorry it seems there is no such user that use this email...Make sure you inserted the right email address.'
            })
        }
    }catch(err){
        throw err
    }
}

module.exports = ForgotPassword