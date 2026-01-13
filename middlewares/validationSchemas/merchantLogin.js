const joi = require("joi");

const Schema = joi.object({
  email: joi.string().email().empty('').required().messages({
    "string.base": "email must be string",
    "string.email": "email must be valid email",
    "any.required": "email must be required"
  }),
  password: joi.string().empty('').required().messages({
    "string.base": "password must be string",
    "any.required": "password is required"
  }),
});

module.exports = Schema