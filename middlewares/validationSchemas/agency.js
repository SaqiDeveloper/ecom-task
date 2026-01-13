const joi = require("joi");

const acceptRequest = joi.object({
  status: joi.string().valid("active", "reject").required().messages({
    "string.base": "Status must be a string",
    "any.only": "Status must be either 'active' or 'reject'",
    "any.required": "Status is required",
  }),

  level: joi.when("status", {
    is: "active",
    then: joi.number().required().messages({
      "number.base": "Level must be a number",
      "any.required": "Level is required when status is active",
    }),
    otherwise: joi.forbidden(), // prevent passing level if status is "reject"
  }),
});


module.exports = { acceptRequest };
