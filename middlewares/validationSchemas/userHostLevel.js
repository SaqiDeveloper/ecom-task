const Joi = require("joi");

const schema = Joi.object({
 
  userCode: Joi.string().required(),
  hostLevelId: Joi.string()
      .guid()
      .required()
      .messages({ "string.guid": "hostLevelId must be a valid UUID" }),
  
});

module.exports = schema;
