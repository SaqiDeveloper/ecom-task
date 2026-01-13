const Joi = require("joi");

const guardianValidation = Joi.object({
  packageId: Joi.string().required().messages({
    "string.empty": "packageId cannot be an empty string",
    "any.required": "packageId is required",
  }),

  userId: Joi.string().required().messages({
    "string.empty": "userId cannot be an empty string",
    "any.required": "userId is required",
  }),

  priceId: Joi.string().required().messages({
    "string.empty": "priceId cannot be an empty string",
    "any.required": "priceId is required",
  }),
});

module.exports = guardianValidation;
