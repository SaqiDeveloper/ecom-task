const Joi = require("joi");

const schema = Joi.object({
  diamond: Joi.number().required().positive(),
  type: Joi.string().valid("send_diamond_by_admin", "send_diamond_by_reseller").required(),
  userCode: Joi.string().required(),
  reason: Joi.when("type", {
    is: "send_diamond_by_admin",
    then: Joi.string().optional().allow(''),
    otherwise: Joi.forbidden() // Ensures `reason` is not allowed if type is not "send_diamond_by_admin"
  })
});

module.exports = schema;
