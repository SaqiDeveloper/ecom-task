const Joi = require("joi");

const inviteAgent = Joi.object({
  agencyRid: Joi.string().required(),
  code: Joi.string().required(),
  otp: Joi.string().required(),
});

module.exports = inviteAgent;
