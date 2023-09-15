const VerifiedUsers = require('../Model/VerifiedUsers')
const TokenDatabase = require('../Model/TokenDatabase')
const ForgotPass = require('../Model/ForgotPass')


async function DeleteId(req, res, next){
    try{
        const {usersl} = req.params 
        const userData = await VerifiedUsers.findById(usersl)
        if(userData){

            // later in project we will delete user videos, video comments, like, dislike , views, and user comments 

            await TokenDatabase.findOneAndDelete({username : userData.username})
            await ForgotPass.findOneAndDelete({email : userData.email})
            await VerifiedUsers.findByIdAndDelete(usersl)

            return res.status(200).json({
                message : 'Your account was successfully deleted ... Thank you for staying with us all this time.'
            })

        }else{
            return res.status(200).json({
                message : 'There is no such user with this account ...'
            })
        }
    }catch(err){
        throw err
    }
}

module.exports = DeleteId