const Joi = require("joi");

const schema = Joi.object({
  invitationCode: Joi.string()
    .empty("")
    .required()
    .messages({
      "any.required": "Invitation Code is required.",
      "string.empty": "Invitation Code cannot be empty.",
    }),
   
//    userId: Joi.string().guid({ version: "uuidv4" }).empty('').required().messages({
//     "string.base": "User id must be a string",
//     "any.required": "User Id is required",
//     "string.guid": "User id must be a valid UUID"
//    }) 
});

module.exports = schema;
