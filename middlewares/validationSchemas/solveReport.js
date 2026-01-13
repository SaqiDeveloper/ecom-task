const Joi = require("joi");

const schema = Joi.object({
  id: Joi.string().guid({ version: "uuidv4" }).required().messages({
    "string.base": "Id must be a string",
    "any.required": "Id is required",
    "string.guid": "Id must be a valid UUID",
  }),
  
});

module.exports = schema;
