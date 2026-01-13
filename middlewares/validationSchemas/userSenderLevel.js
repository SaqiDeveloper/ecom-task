const Joi = require("joi");

const schema = Joi.object({
  userCode: Joi.string().required(),
  senderLevelId: Joi.string()
    .guid()
    .required()
    .messages({ "string.guid": "senderLevelId must be a valid UUID" }),
});

module.exports = schema;
