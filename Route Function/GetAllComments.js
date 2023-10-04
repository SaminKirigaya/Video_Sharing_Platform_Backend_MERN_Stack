const  Comment = require('../Model/Comment')
const CommentReplay = require('../Model/CommentReplay')

async function GetAllComments(req, res, next){
    try{
        const {videoSl} = req.body 
        const isCommentThere = await Comment.find({videoSerial : videoSl}).lean()
        if(isCommentThere){
          
                if(isCommentThere.length>1){
                    await Promise.all(
                    isCommentThere.map(async(each)=>{
                        const isReplay = await CommentReplay.find({commentSerial: each._id}).lean()
                        if(isReplay){
                            each.replay = isReplay
                        }
                    })
                    )

                }else if(isCommentThere[0]){
                        
                        const isRep = await CommentReplay.find({commentSerial: isCommentThere[0]._id}).lean()
                        const [isReplay] = await Promise.all([isRep])
                        if(isReplay){
                            
                            isCommentThere[0].replay = isReplay
                        }
                    
                        
                }
           
                

            return res.status(200).json({
                message : 'success',
                comments : isCommentThere
            })
        }else{

            return res.status(200).json({
                message : 'Failed'
            })

        }
    }catch(err){
        throw err
    }

}

module.exports = GetAllComments