const Joi = require("joi");

const schema = Joi.object({
 
  userCode: Joi.string().required(),
  streamTagId: Joi.string().uuid().required(), 
  expiredAt: Joi.string().isoDate().required(), 
});

module.exports = schema;
