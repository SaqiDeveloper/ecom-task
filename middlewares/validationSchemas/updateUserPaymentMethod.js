const Joi = require("joi");

const baseSchema = Joi.object({
  paymentMethodId: Joi.string().empty('').messages({
    "string.base": "Payment Method must be a string",
  }),

  type: Joi.string()
    .valid("bank", "jazzcash", "easypaisa", "usdt", "epay", "binance")
    .required()
    .messages({
      "any.only": "Type must be one of bank, jazzcash, easypaisa, usdt, epay, binance",
      "any.required": "Type is required",
    }),

  fields: Joi.when("type", {
    switch: [
      {
        is: "epay",
        then: Joi.object({
          account: Joi.string().email().required().messages({
            "string.base": "Account must be a string",
            "string.email": "Account must be a valid email address",
            "any.required": "Account is required",
          }),
        }).required().messages({
          "object.base": "Fields must be an object",
          "any.required": "Fields are required",
        }),
      },
      {
        is: Joi.valid("jazzcash", "easypaisa"),
        then: Joi.object({
          holderName: Joi.string().required().messages({
            "string.base": "Holder name must be a string",
            "string.empty": "Holder name is required",
            "any.required": "Holder name is required",
          }),
          accountNumber: Joi.string().required().messages({
            "string.base": "Account number must be a string",
            "string.empty": "Account number is required",
            "any.required": "Account number is required",
          }),
        }).required().messages({
          "object.base": "Fields must be an object",
          "any.required": "Fields are required",
        }),
      },
      {
        is: "bank",
        then: Joi.object({
          bankName: Joi.string().required().messages({
            "string.base": "Bank Name must be a string",
            "any.required": "Bank Name is required",
            "string.empty": "Bank Name is required",
          }),
          holderName: Joi.string().required().messages({
            "string.base": "Holder Name must be a string",
            "any.required": "Holder Name is required",
            "string.empty": "Holder Name is required",
          }),
          bankAccount: Joi.number().strict().required().messages({
            "number.base": "Bank Account must be a number",
            "any.required": "Bank Account is required",
          }),
          ibanNumber: Joi.string().required().messages({
            "string.base": "Iban Number must be a string",
            "any.required": "Iban Number is required",
            "string.empty": "Iban Number is required",
          }),
        }).required().messages({
          "object.base": "Fields must be an object",
          "any.required": "Fields object is required",
        }),
      },
      {
        is: Joi.valid("binance", "usdt"),
        then: Joi.object({
          name: Joi.string().messages({
            "string.base": "Name must be a string",
          }),
          walletAddress: Joi.string().required().messages({
            "string.base": "Wallet Address must be a string",
            "string.empty": "Wallet Address is required",
            "any.required": "Wallet Address is required",
          }),
        }).required().messages({
          "object.base": "Fields must be an object",
          "any.required": "Fields are required",
        }),
      },
    ],
    otherwise: Joi.forbidden().messages({
      "any.unknown": "Invalid type provided",
    }),
  }),
});

module.exports = baseSchema;
