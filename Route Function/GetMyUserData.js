const VerifiedUsers = require('../Model/VerifiedUsers')

async function GetMyUserData(req, res, next){
    try{

        const {usersl} = req.params 
        const getData = await VerifiedUsers.findById(usersl)
        if(getData){
            return res.status(200).json({
                message : 'success',
                username : getData.username,
                fullname : getData.fullName,
                gender : getData.gender,
                country : getData.country,
                dateofbirth : getData.dateOfBirth,
                address : getData.address,
            })
        }else{
            return res.status(200).json({
                message : 'Some Error Occured ...'
            })
        }

    }catch(err){
        throw err
    }
}

module.exports = GetMyUserData