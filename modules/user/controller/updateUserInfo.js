// @ts-nocheck
const fs=require("fs")

const userModel=require("../../../Database/model/User");
const HttpError = require("../../../util/HttpError");
const path = require("path");

const updateUserInfo=(request,response,next)=>{
    const userId=request.userInfo.id;
    const {userName,firstName,lastName,email,password,phone,age,gender}=request.body;
    const profilePicture=request.file?.filename;
    userModel.findByIdAndUpdate(userId,{userName,firstName,lastName,email,password,phone,age,gender,profilePicture})
    .then(preUpdatedUser=>{
        if(preUpdatedUser){
            if(profilePicture){
                fs.unlink(path.join(__dirname,"../../../upload/profileImages/"+preUpdatedUser.profilePicture),(error)=>{
                    if(error){
                        console.log("Error occurred during file delete: "+error)
                    }else{
                        console.log("old profile image was deleted")
                    }
                })
            }
            response.status(201).json({message:"successful updateUserInfo"})
    }else{
        response.status(403).json({message:"Unable to update this profile Information"})
    }
    }).catch(error=>{  
            console.log("Error Occured: ")
            console.log(error)
            next(new HttpError(500,"An Error Occured On server"))
    })
}

module.exports=updateUserInfo;