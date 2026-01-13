const Joi = require("joi");

const schema = Joi.object({
 withdrawPaymentMethodId: Joi.string().uuid().required().messages({
     "string.base": "Withdraw Payment Method must be a string",
     "string.empty": "Withdraw Payment Method ID is required",
     "any.required": "Withdraw Payment Method ID is required",
     "string.guid": "Withdraw Payment Method ID must be a valid UUID"
   }),
  fields: Joi.object({
    name: Joi.string().messages({
      "string.base": "Name must be a string",
    }),
    walletAddress: Joi.string().messages({
      "string.base": "Wallet Address must be a string",
      "string.empty": "Wallet Address is required",
    }),
  }).messages({
    "object.base": "Fields must be an object"
  })
});

module.exports = schema;