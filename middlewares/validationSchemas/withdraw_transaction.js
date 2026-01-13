const Joi = require("joi");

const schema = Joi.object({
  methodId: Joi.string().guid({ version: "uuidv4" }).required().messages({
    "any.required": "Method ID is required.",
    "string.guid": "Method ID must be a valid UUID.",
    "string.empty": "Method ID cannot be empty.",
  }),

  amount: Joi.number().required().positive().messages({
    "any.required": "Amount is required.",
    "number.base": "Amount must be a number.",
    "number.positive": "Amount must be a positive number.",
  }),
});

module.exports = schema;
