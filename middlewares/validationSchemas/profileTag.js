const Joi = require("joi");

const schema = Joi.object({
  type: Joi.string()
    .empty("") 
    .required()
    .valid(
      "official",
      "admin",
      "starAgency",
      "businessDevelopment",
      "customerSupport"
    )
    .messages({
      "any.required": "Type is required.",
      "string.empty": "Type is required.",
      "any.only":
        "Type must be one of the following: official, admin, starAgency, businessDevelopment, customerSupport.",
    }),

  pictureUrl: Joi.string()
    .empty("")
    .required()
    .messages({
      "any.required": "Picture URL is required.",
      "string.empty": "Picture URL cannot be empty.",
    }),
});

module.exports = schema;
