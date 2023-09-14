const TokenDatabase = require('../Model/TokenDatabase')

async function LogMeOut(req, res, next){
    try{
        const totalToken = req.headers['authorization'];
        const token = totalToken.split(' ')[1];

        const isinTokenDB = await TokenDatabase.findOne({token : token})
        if(isinTokenDB){
            await TokenDatabase.findOneAndDelete({token : token})

            return res.status(200).json({
                message : 'You have successfully logged out ...'
            })
            
        }else{
            return res.status(200).json({
                message : 'It seems the token with authorization is invalid !!!'
            })
        }
    }catch(err){
        throw err
    }
}

module.exports = LogMeOut