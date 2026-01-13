const Joi = require("joi");


const donationLogHistory = Joi.object({
  type: Joi.string().required().valid("sent", "recieved").empty("").messages({
    "string.base": "type must be a string",
    "any.required": "type is required",
    "any.only": "type must be either 'sent' or 'recieved'",
  }),
}); 

module.exports = {
donationLogHistory
}