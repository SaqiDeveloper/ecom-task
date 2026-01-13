const Joi = require("joi");

const schema = Joi.object({
  withdrawPaymentMethodId: Joi.string().uuid().required().messages({
    "string.base": "Withdraw Payment Method must be a string",
    "string.empty": "Withdraw Payment Method ID is required",
    "any.required": "Withdraw Payment Method ID is required",
    "string.guid": "Withdraw Payment Method ID must be a valid UUID"
  }),
  fields: Joi.object({
    bankName: Joi.string().required().messages({
      "string.base": "Field Bank Name must be a string",
      "any.required": "Field Bank Name is required",
      "string.empty": "Bank Name is required",
    }),
    holderName: Joi.string().required().messages({
      "string.base": "Field Holder Name must be a string",
      "any.required": "Field Holder Name is required",
      "string.empty": "Holder Name is required",
    }),
    bankAccount: Joi.number().strict().required().messages({
      "number.base": "Bank Account must be a number",
      "any.required": "Bank Account is required"
    }),
    ibanNumber: Joi.string().required().messages({
      "string.base": "Field Iban Number must be a string",
      "any.required": "Field Iban Number is required",
      "string.empty": "Iban Number is required",
    }),
  }).required().messages({
    "object.base": "Fields must be an object",
    "any.required": "Fields object is required",
  }),
});

module.exports = schema;

