require('dotenv').config()
const DB = require('../Model/DB')
const VerifiedUsers = require('../Model/VerifiedUsers')
const UsersInQuee = require('../Model/UsersInQuee')
const Otp = require('../Model/Otp')
const bcrypt = require('bcrypt')
const path = require('path')
const fs = require('fs')
const nodemailer = require('nodemailer')
const joi = require('joi')
const jimp = require('jimp')


const schema = joi.object({
    Email : joi.string().email().required(),
    Username : joi.string().pattern(/^([0-9a-zA-Z_]+)$/).required().error(new Error('Username must only contain 0-9, a-z, A-Z or _')),
    Fullname : joi.string().pattern(/^([a-zA-Z ]+)$/).required().error(new Error('Full name can only contain a-z, A-Z or space.')),
    Gender : joi.string().required(),
    Country : joi.string().required(),
    Address : joi.string().pattern(/^([0-9a-zA-Z-,\/ ]+)$/).required().error(new Error('Address can only have 0-9, a-z, A-Z,-,/ and ,')),
    Birth_Date : joi.date().required(),
    Password : joi.string().pattern(/^([0-9a-zA-Z@!_]+){6,50}$/).required().error(new Error('Password can only contain 0-9, a-z, A-Z, @, !, _ also it must never have space and it must be from 6-50 characters.')),
    Confirmed_Password : joi.string().valid(joi.ref('Password')).required(),
})


function generateOTP(){
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


async function SignUp(req, res, next){
    try{
        const {error} = schema.validate(req.body)
        if(error){
            if(req.files){
                if(req.files['Profile_Image'] && req.files['Profile_Image'][0]){
                    fs.unlinkSync(req.files['Profile_Image'][0].path)
                }

                if(req.files['Cover_Image'] && req.files['Cover_Image'][0]){
                    fs.unlinkSync(req.files['Cover_Image'][0].path)
                }
            }

            return res.status(200).json({ message : error.message});
        }

        if(!req.files){
            if(req.files['Profile_Image'] && req.files['Profile_Image'][0]){
                fs.unlinkSync(req.files['Profile_Image'][0].path)
            }

            if(req.files['Cover_Image'] && req.files['Cover_Image'][0]){
                fs.unlinkSync(req.files['Cover_Image'][0].path)
            }

            return res.status(200).json({ message : 'Image file is required!' });
        }

        const profile_image = req.files['Profile_Image'][0]
        const cover_image = req.files['Cover_Image'][0]

        const emailAlready = await VerifiedUsers.findOne({email : req.body.Email})
        const emailInVerify = await UsersInQuee.findOne({email : req.body.Email})
   
        if(emailAlready || emailInVerify){
            fs.unlinkSync(req.files['Profile_Image'][0].path)
            fs.unlinkSync(req.files['Cover_Image'][0].path)

            return res.status(200).json({ message: 'Sorry Email Already Exist ... You Can Not Use Same Email Twice.' });
        }

        const usernameTakenAlready = await VerifiedUsers.findOne({username : req.body.Username}) 
        const usernameTakenQuee = await UsersInQuee.findOne({username : req.body.Username}) 

        if(usernameTakenAlready || usernameTakenQuee){
            fs.unlinkSync(req.files['Profile_Image'][0].path)
            fs.unlinkSync(req.files['Cover_Image'][0].path)

            const newLast1 = generateOTP()
            const newLast2 = generateOTP()
            const newLast3 = generateOTP()

            const avail1 = req.body.Username+newLast1
            const avail2 = req.body.Username+newLast2
            const avail3 = req.body.Username+newLast3


            return res.status(200).json({ message: `The Username is already taken ... You can try ${avail1} or ${avail2} or ${avail3} ...` });
        }
   
        const passz = req.body.Password;
        const saltRounds = 10;
        const pass2 = await bcrypt.hash(passz, saltRounds);  
        const email = req.body.Email;
        const dateofBirthz = req.body.Birth_Date;
        const usernamez = req.body.Username;
        const genderz = req.body.Gender;
        const fullname = req.body.Fullname;
        const countryz = req.body.Country;
        const addressz = req.body.Address;
    
        const profileImagePath = path.join('public/images', profile_image.filename)
        const readIt = await jimp.read(profile_image.path)
        await readIt.resize(100, 100).quality(80).writeAsync(profileImagePath)

        const globalProfileImage = `${process.env.IMG}/public/images/${profile_image.filename}`;
        const globalCoverImage = `${process.env.IMG}/public/images/${cover_image.filename}`;

        const setInVerify = new UsersInQuee({
            email : email,
            username : usernamez,
            fullName : fullname, 
            password : pass2,
            gender :  genderz,
            country : countryz,
            address : addressz,
            dateOfBirth : dateofBirthz,
            profileImage : globalProfileImage,
            coverImage : globalCoverImage,
        })

        await setInVerify.save();

        if(setInVerify){
            const otp = generateOTP()
            const mailDetails = {
                from : 'VideoHubBD',
                to : `${email}`,
                subject : 'Account Verification Code.',
                text : `Your Verification Code is "${otp}" Kindly Use It In Verify Page.`
            }

            transporter.sendMail(mailDetails, async(error, info)=>{
                if(error){
                    return res.status(200).json({
                        message : 'Some Error Occured.'
                    })
                }else{
                    const setTheOtp = new Otp({
                        email : email,
                        otp : otp,
                    })

                    await setTheOtp.save()

                    return res.status(200).json({
                        message : 'Sign Up Successful. You Are Provided A OTP In Your Mail That You Provided. Kindly Verify It In The Verification Page. To Activate Your Account.'
                    })
                }
            })
        }

    }catch(err){
        throw err
    }
}

module.exports = SignUp