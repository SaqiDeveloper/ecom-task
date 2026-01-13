const Joi = require("joi");

const schema = Joi.object({
 
  reason: Joi.string().required(),
});

module.exports = schema;
