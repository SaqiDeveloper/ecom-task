const joi = require("joi")

const schema = joi.object({
    picture:joi.string().messages({
        "string.base":"Picture must be string",
    }),
    name:joi.string().required().messages({
        "string.base":"Name must be string",
        "any.required":"Name is required"
    }),
    country:joi.string().required().messages({
        "string.base":"Country must be string",
        "any.required":"Country is required"
    }),
    email:joi.string().email().messages({
        "string.base":"Email must be string",
        "sttring.email":"Email must be valid email"
    }),
    phone:joi.string().messages({
        "string.base":"Phone must be string"
    }),
    address:joi.string().messages({
        "string.base":"Address must be string"
    }),
    userName:joi.string().required().messages({
        "string.base":"Username must be string",
        "any.required":"Username is required"
    }),
    password:joi.string().required().messages({
        "string.base":"Password must be string",
        "any.required":"Password is required"
    }),
    bankName:joi.string().messages({
        "string.base":"Bank name must be string"
    }),
    bankAccountNumber:joi.string().messages({
        "string.base":"Bank Account Number must be string"
    }),
    whatsapp:joi.string().messages({
        "string.base":"Whatsapp must be string"
    })
})

module.exports = schema