const Joi = require("joi");

const update = Joi.object({
  status: Joi.string()
    .valid("approved", "rejected", "pending")
    .required()
    .messages({
      "string.base": "status must be a string",
      "any.only": "status must be either 'approved', 'rejected' or 'pending'",
      "any.required": "status is required",
    }),

  reason: Joi.when('status', {
    is: 'rejected',
    then: Joi.string().required().messages({
      "any.required": "reason is required when status is rejected",
      "string.base": "reason must be a string"
    }),
    otherwise: Joi.string().optional().allow('').messages({
      "string.base": "reason must be a string"
    }),
  }),
});
const deleted = Joi.object({
  reason: Joi.string()
    .required()
    .messages({
      "string.base": "reason must be a string",
      "any.required": "reason is required",
    }),
});

module.exports = {
  update,
  deleted
};
