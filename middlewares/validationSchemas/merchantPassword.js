const joi = require("joi")

const schema = joi.object({
    newPassword:joi.string().required().messages({
        "string.base":"New Password must be string",
        "any.required":"New Password is required"
    }),
    confirmPassword:joi.string().required().messages({
        "string.base":"Confirm password must be string",
        "any.required":"Confirm password is required"
    })
})

module.exports = schema