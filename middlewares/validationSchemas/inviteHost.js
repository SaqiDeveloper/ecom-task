const Joi = require("joi");

const inviteHost = Joi.object({
  agencyRid: Joi.string().empty('').required(),
  code: Joi.string().empty('').required(),
});

module.exports = inviteHost;
