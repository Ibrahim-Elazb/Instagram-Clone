const Joi = require("joi");
const { ref } = require("joi");

const signUpValidationSchema={
    body:Joi.object().required().keys({
        userName:Joi.string().pattern(new RegExp(/^[a-zA-Z0-9]([._-]|[a-zA-Z0-9]){3,30}[a-zA-Z0-9]$/)).required().messages({
            "any.required":"You must enter user name",
            "string.empty":"You must enter user name",
            "string.pattern.base":`user name must start with letter, contains letters, numbers and(. , - , _ ) only. Name should be at least 5 characters, at maximum 32 characters`,
        }),
        firstName:Joi.string().pattern(new RegExp(/^[a-zA-Z0-9]([._-]|[a-zA-Z0-9]){1,30}[a-zA-Z0-9]$/)).required().messages({
            "any.required":"You must first enter name",
            "string.empty":"You must first enter name",
            "string.pattern.base":`first name must start with letter, contains letters, numbers and(. , - , _ ) only. first Name should be at least 3 characters, at maximum 30 characters`,
        }),
        lastName:Joi.string().pattern(new RegExp(/^[a-zA-Z0-9]([._-]|[a-zA-Z0-9]){1,30}[a-zA-Z0-9]$/)).required().messages({
            "any.required":"You must enter last name",
            "string.empty":"You must enter last name",
            "string.pattern.base":`last name must start with letter, contains letters, numbers and(. , - , _ ) only. last Name should be at least 3 characters, at maximum 30 characters`,
        }),
        email:Joi.string().email().required().messages({
            "any.required":"You must enter Email",
            "string.empty":"You must enter Email",
            "string.email":"Enter valid email"
        }),
        password:Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/)).required().messages({
            "any.required":"You must enter Password",
            "string.empty":"You must enter password",
            "string.pattern.base":` password  at least 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number and Can contain special characters`,
        }),
        confirmPassword:Joi.string().valid(ref("password")).required().messages({
            "any.required":"You must enter Confirm Password",
            "string.empty":"You must enter Confirm password",
            "any.only":"password and confirm password should be the same"
        }),
        age:Joi.number().min(18).required().messages({
            "any.required":"You must enter age",
            "number.min":"only to older than 18 years old"
        }),
        phone:Joi.string().pattern(new RegExp(/^01[0-2|5]\d{8}$/)).messages({
            // "any.required":"You must enter phone number",
            "string.pattern.base":"Phone number should be only numbers starts with 010,011,012,015 and contains 11 numbers (Egeyptian Mobile Numbers)"
        }),
        gender:Joi.string().pattern(new RegExp(/^[mM][aA][lL][eE]|[fF][eE][mM][aA][lL][eE]$/)).messages({
            "string.pattern.base":"gender is male or female"
        }),
        role:Joi.string().pattern(new RegExp(/^[uU][sS][eE][rR]|[aA][dD][mM][iI][nN]|[hH][rR]$/)).messages({
            "string.pattern.base":"invalid role, valid roles are user,admin,hr"
        })
    })
}

const loginValidationSchema={
    body:Joi.object().required().keys({
        email:Joi.string().email().required().messages({
            "any.required":"You must enter Email",
            "string.empty":"You must enter Email",
            "string.email":"Enter valid email"
        }),
        password:Joi.string().required().messages({
            "any.required":"You must enter Password",
            "string.empty":"You must enter password",
        })
    })
}

const forgetPasswordValidationSchema={
    body:Joi.object().required().keys({
        email:Joi.string().email().required().messages({
            "any.required":"You must enter Email",
            "string.empty":"You must enter Email",
            "string.email":"Enter valid email"
        })
    })
}

const resetPasswordValidationSchema={
    body:Joi.object().required().keys({
        email:Joi.string().email().required().messages({
            "any.required":"You must enter Email",
            "string.empty":"You must enter Email",
            "string.email":"Enter valid email"
        }),
        password:Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/)).required().messages({
            "any.required":"You must enter Password",
            "string.empty":"You must enter password",
            "string.pattern.base":` password  at least 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number and Can contain special characters`,
        }),
        confirmPassword:Joi.string().valid(ref("password")).required().messages({
            "any.required":"You must enter Confirm Password",
            "string.empty":"You must enter Confirm password",
            "any.only":"password and confirm password should be the same"
        }),
        resetCode:Joi.number().max(999999).required().messages({
            "any.required":"You must enter reset Code",
            "number.base":"You must enter reset Code",
            "number.max":"Invalid Reset Code"
        })
    })
}

module.exports={signUpValidationSchema,loginValidationSchema,forgetPasswordValidationSchema,resetPasswordValidationSchema};