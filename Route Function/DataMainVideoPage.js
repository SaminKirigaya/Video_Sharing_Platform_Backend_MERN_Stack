const VerifiedUsers = require('../Model/VerifiedUsers')
const UploadedVideos = require('../Model/UploadedVideos')


async function DataMainVideoPage(req, res, next){
    try{
        const {videoSl} = req.body 
        const findingVideo = await UploadedVideos.findById(videoSl).lean()

        if(findingVideo){

            const userData = await VerifiedUsers.findById(findingVideo.userSerial)
           
            findingVideo.userName = userData.username
            findingVideo.userImage = userData.profileImage
        

            if(findingVideo.tags.includes(',')){
                
                var  allSameVids = []   
                var videoIdSet = new Set()
                var finalSameVids = []

                let splittedTag = findingVideo.tags.split(',')
               
                await Promise.all(
                splittedTag.map(async(each)=>{
                    
                    var isThereSame = await UploadedVideos.find({$text : {$search : each}}).lean()
                   
                    allSameVids.push(isThereSame)

                    
                    allSameVids.map((each)=>{
                        
                        each.map((perItem)=>{
                            
                            if(!videoIdSet.has(perItem._id.toString())){
                                videoIdSet.add(perItem._id.toString())  
                                finalSameVids.push(perItem)
                            }
    
                  
                        }) 


                    finalSameVids.filter((each)=>{
                        
                        
                        return  each._id.toString() != videoSl.toString()
                        
                        
                    })   
    
                    
                })

                    

               
           
             
                
                })
                
                )
                
                await Promise.all(
                    finalSameVids.map(async(each)=>{
                        
                        
                        var userData = await VerifiedUsers.findById(each.userSerial)
                        each.profileImage = userData.profileImage
                        
                    })
                )

                var filterIt = []

                await Promise.all(
                    finalSameVids.map((each)=>{
                        if(each._id != videoSl){
                            filterIt.push(each)
                        }
                    })
                )


                return res.status(200).json({
                    message : 'success',
                    videourl : findingVideo.videoLink,
                    videolike: findingVideo.likeamount,
                    videodislike: findingVideo.dislikedamount,
                    videouploadtime : findingVideo.uploadingDate,
                    videotitle : findingVideo.title,
                    videodescription: findingVideo.description,
                    videousername : findingVideo.userName,
                    videouserimage : findingVideo.userImage,
                    videotags : findingVideo.tags,
                    sameTypeVids : filterIt,
                })



            }else{

                
                var  allSameVids = []   
                var videoIdSet = new Set()
                var finalSameVids = []

                
                let isThereSame = await UploadedVideos.find({$text : {$search : findingVideo.tags}}).lean()
                allSameVids.push(isThereSame)

                await Promise.all(
                allSameVids.map((each)=>{
                        
                    each.map((perItem)=>{
                        
                        if(!videoIdSet.has(perItem._id.toString())){
                            videoIdSet.add(perItem._id.toString())  
                            finalSameVids.push(perItem)
                        }
                        
                    })
                    

                    finalSameVids.filter((each)=>{
                        console.log(each._id.toString(),videoSl)
                        
                        return  each._id.toString() != videoSl
                        
                        
                    })

                    console.log(finalSameVids)

                })

                
                )
                
                await Promise.all(
                    finalSameVids.map(async(each)=>{
                        
                        
                        var userData = await VerifiedUsers.findById(each.userSerial)
                        each.profileImage = userData.profileImage
                        
                    })
                )

               
                var filterIt = []

                await Promise.all(
                    finalSameVids.map((each)=>{
                        if(each._id != videoSl){
                            filterIt.push(each)
                        }
                    })
                )



                return res.status(200).json({
                    message : 'success',
                    videourl : findingVideo.videoLink,
                    videolike: findingVideo.likeamount,
                    videodislike: findingVideo.dislikedamount,
                    videouploadtime : findingVideo.uploadingDate,
                    videotitle : findingVideo.title,
                    videodescription: findingVideo.description,
                    videousername : findingVideo.userName,
                    videouserimage : findingVideo.userImage,
                    videotags : findingVideo.tags,
                    sameTypeVids : filterIt,
                })
            }
        

           

        }else{
            return res.status(200).json({
                message: 'Failed to retrive data ...'
            })
        }

    }catch(err){
        throw err
    }
}

module.exports = DataMainVideoPage