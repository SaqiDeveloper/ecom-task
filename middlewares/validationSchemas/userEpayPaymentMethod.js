const Joi = require("joi");

const schema = Joi.object({
  withdrawPaymentMethodId: Joi.string().messages({
    "string.base": "Withdraw Payment Method must be a string"
  }),

  fields: Joi.object({
    account: Joi.string()
    .empty('')
      .email()
      .required()
      .messages({
        "string.base": "Account must be a string",
        "string.email": "Account must be a valid email address",
        "any.required": "Account is required"
      }),
  }).required().messages({
    "object.base": "Fields must be an object",
    "any.required": "Fields are required"
  })
});   



module.exports = schema;
