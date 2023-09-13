const VerifiedUsers = require('../Model/VerifiedUsers')
const UsersInQuee = require('../Model/UsersInQuee')
const Otp = require('../Model/Otp')
const ForgotPass = require('../Model/ForgotPass')

async function VerifyOtp(req, res, next){
    try{
        const {Email, OtpCode} = req.body

        const emailInOtp = await Otp.findOne({email : Email})
        if(emailInOtp){
            const emailInQuee = await UsersInQuee.findOne({email : Email})
            if(emailInQuee){
                if(emailInOtp.otp == OtpCode){

                    const saveInVerified = new VerifiedUsers({
                        email : emailInQuee.email,
                        username : emailInQuee.username,
                        fullName : emailInQuee.fullName, 
                        password : emailInQuee.password,
                        gender :  emailInQuee.gender,
                        country : emailInQuee.country,
                        address : emailInQuee.address,
                        dateOfBirth : emailInQuee.dateOfBirth,
                        profileImage : emailInQuee.profileImage,
                        coverImage : emailInQuee.coverImage,
                    })
    
                    await saveInVerified.save()

                    const setForgotTable = new ForgotPass({
                        email : emailInQuee.email,
                        password : emailInQuee.password,
                    })

                    await setForgotTable.save()

                    await UsersInQuee.deleteOne({email : Email})
                    await Otp.deleteOne({email : Email})

                    return res.status(200).json({
                        message : 'Verification Successful !!! Please login for first time in login page.'
                    })

                }else{
                    return res.status(200).json({ message: 'The OTP code you sent was invalid. Please, make sure to check the case and characters.' });
                }
                
            }else{
                return res.status(200).json({ message: 'Sorry the email is invalid ...' });
            }
        }else{
            return res.status(200).json({ message: 'Sorry the email is invalid ...' });
        }
    }catch(err){
        throw err
    }
}

module.exports = VerifyOtp