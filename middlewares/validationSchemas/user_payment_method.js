const Joi = require("joi");

const schema = Joi.object({
  withdrawPaymentMethodId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.base": "Withdraw Payment Method must be a string",
      "string.empty": "Withdraw Payment Method ID is required",
      "any.required": "Withdraw Payment Method ID is required",
      "string.guid": "Withdraw Payment Method ID must be a valid UUID"
    }),

  fields: Joi.object({
    holderName: Joi.string()
      .required()
      .messages({
        "string.base": "Holder name must be a string",
        "string.empty": "Holder name is required",
        "any.required": "Holder name is required"
      }),
    
    accountNumber: Joi.string()
      .required()
      .messages({
        "string.base": "Account number must be a string",
        "string.empty": "Account number is required",
        "any.required": "Account number is required"
      })
  }).required().messages({
    "object.base": "Fields must be an object",
    "any.required": "Fields are required"
  })
});  

module.exports = schema;
