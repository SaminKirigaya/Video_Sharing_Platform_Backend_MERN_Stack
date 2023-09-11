const VerifiedUsers = require('../Model/VerifiedUsers')
const TokenDatabase = require('../Model/TokenDatabase')

async function Authenticate(req, res, next){
    try{
        const {usersl} = req.params;
        const totalToken = req.headers['authorization'];
        const token = totalToken.split(' ')[1];

        const inToken = TokenDatabase.findOne({token : token});
        if(inToken){
            const realUser = VerifiedUsers.findById(usersl);
            if(realUser){
                if(realUser.username == inToken.username){
                    next()
                }else{
                    return res.status(200).json({
                        message : 'Sorry Invalid Token According To User Data ...'
                    })
                }
            }else{
                return res.status(200).json({
                    message : 'Sorry No Such Users Exists ...'
                })
            }
        }else{
            return res.status(200).json({
                message : 'Sorry Token in Invalid ...'
            })
        }
    }catch(err){
        throw err
    }
}

module.exports = Authenticate