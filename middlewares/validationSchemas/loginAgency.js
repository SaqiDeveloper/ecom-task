const Joi = require("joi");

const validation = Joi.object({
  rid: Joi.string().empty("")
    .required()
    .messages({
      "string.base": "rid must be a string",
      "any.required": "rid is required",
    }),

  password: Joi.string()
    .required()
    .messages({
      "string.base": "password must be a string",
      "any.required": "password is required",
    }),
});

module.exports = validation;
