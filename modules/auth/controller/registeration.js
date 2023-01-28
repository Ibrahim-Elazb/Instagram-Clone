// @ts-nocheck
const jwt=require("jsonwebtoken");

const userModel=require("../../../Database/model/User");
const sendEmail = require("../../../Services/SendEmail");
const HttpError = require("../../../util/HttpError");

const registeration=(request,response,next)=>{
    const {userName,firstName,lastName,email,password,phone,age,gender}=request.body;
    const profilePicture=request.file.filename;
    const newUser=new userModel({userName,firstName,lastName,email,password,phone,age,gender,profilePicture});
    newUser.save().then(createdUser=>{
        // console.log(result)
        const token=jwt.sign({id:createdUser._id,userName:createdUser.userName,email:createdUser.email},
            process.env.CONFIRM_EMAIL_TOKEN_SECRET,{expiresIn:"1h"})
            const confirmationURL=`${request.protocol}://${request.hostname}:${process.env.PORT}/api/auth/confirmEmail/${token}`
            const message=`<div>
            <p>This is confirmation from ${request.host}</p>
            <p>This is link is valid for only one hour</p>
            <a href=${confirmationURL}>Confirmation Link</a>
            </div>`
        sendEmail("ibrahimElazb2010@gmail.com",`Confirmation Email from ${request.host}`,message)
        response.status(201).json({message:"successful Registeration"})
    }).catch(error=>{
        if(error.keyValue?.email){
            next(new HttpError(400,"Email is already exist"))
        }else{
            console.log("Error Occured: ")
            console.log(error)
            next(new HttpError(500,"An Error Occured On server"))
        }
    })
}

module.exports=registeration;