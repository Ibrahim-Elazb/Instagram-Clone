const Joi = require("joi");

const newPostValidationSchema = {
    body: Joi.object().required().keys({
        text: Joi.string().messages({
            "string.empty": "Unable to enter Empty Text"
        })
    })
}

const editPostValidationSchema = {
    body: Joi.object().required().keys({
        text: Joi.string().messages({
            "string.empty": "Unable to enter Empty Text"
        })
    }),
    params: Joi.object().required().keys({
        postId: Joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)).required().messages({
            "any.required": "Invalid Link",
            "string.empty": "Invalid Link",
            "string.pattern.base": "Invalid Link"
        })
    })
}

const findPostValidationSchema = {
    params: Joi.object().required().keys({
        postId: Joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)).required().messages({
            "any.required": "Invalid Link",
            "string.empty": "Invalid Link",
            "string.pattern.base": "Invalid Link"
        })
    })
}


module.exports = { newPostValidationSchema, editPostValidationSchema, findPostValidationSchema  };