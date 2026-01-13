const Joi = require("joi");

const schema = Joi.object({
  orderNumber: Joi.string().required().messages({
    "string.base": "Order Number must be a string",
    "any.required": "Order Number  is required",
  }),
  imageId: Joi.string().guid({ version: "uuidv4" }).required().messages({
    "string.base": "Image id must be a string",
    "any.required": "Image Id is required",
    "string.guid": "Image id must be a valid UUID",
  }),
  
  message: Joi.string()
    .required()
    .messages({
      "string.required": "Reason is required",
    }),
});

module.exports = schema;
