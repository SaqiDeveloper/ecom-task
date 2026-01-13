const Joi = require("joi");

const pkValidation = Joi.object({
  name: Joi.string()
    .required()
    .min(1) // Ensures at least one character is present
    .messages({
      "string.empty": "Name cannot be an empty string",
      "any.required": "Name is required",
    }),

  opponentOne: Joi.string().required().messages({
    "any.required": "opponentOne is required",
  }),

  opponentTwo: Joi.string().required().messages({
    "any.required": "opponentTwo is required",
  }),

  pkDate: Joi.string().required().messages({
    "any.required": "pkDate is required",
  }),

  location: Joi.string().valid("Pakistan", "Global").required().messages({
    "any.required": "Location is required",
    "string.empty": "Location cannot be an empty string",
  }),
});

const pkRequest = Joi.object({
  requestedUserRid: Joi.string().empty("").required().messages({
    "string.base": "requestedUserRid must be a string",
    "any.required": "requestedUserRid is required",
  }),

  pkDate: Joi.date()
    .min("now") // allows today and future dates
    .required()
    .empty("")
    .messages({
      "date.base": "pkDate must be a valid date",
      "date.min": "pkDate cannot be in the past",
      "any.required": "pkDate is required",
    }),

  location: Joi.string()
    .empty("")
    .valid("Pakistan", "Global")
    .required()
    .messages({
      "string.base": "location must be a string",
      "any.only": "location must be either 'Pakistan' or 'Global'",
      "any.required": "location is required",
    }),
});
const update = Joi.object({
  pkDate: Joi.date()
    .min("now") // allows today and future dates
    .required()
    .empty("")
    .messages({
      "date.base": "pkDate must be a valid date",
      "date.min": "pkDate cannot be in the past",
      "any.required": "pkDate is required",
    }),
  location: Joi.string()
    .empty("")
    .valid("Pakistan", "Global")
    .required()
    .messages({
      "string.base": "location must be a string",
      "any.only": "location must be either 'Pakistan' or 'Global'",
      "any.required": "location is required",
    }),
});
const acceptrequest = Joi.object({
  status: Joi.date().required().valid("accept", "reject").empty("").messages({
    "string.base": "status must be a string",
    "any.required": "status is required",
    "any.only": "status must be either 'accept' or 'reject'",
  }),
});

module.exports = {
  pkValidation,
  pkRequest,
  acceptrequest,
  update,
};
