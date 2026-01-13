const Joi = require("joi");

const schema = Joi.object({
    luckyBoxId: Joi.string().uuid({ version: 'uuidv4' }).empty("").required().messages({
      "string.base": "luckyBoxId must be a valid UUID",
      "string.guid": "luckyBoxId must be a valid UUID",  
      "any.required": "luckyBoxId is required"             
   }),
});

module.exports = schema;
