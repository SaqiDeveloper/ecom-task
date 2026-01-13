const Joi = require("joi");

const schema = Joi.object({
  pictureId: Joi.string().empty("").guid({ version: ['uuidv4', 'uuidv5'] }).required().messages({
    "string.base": "Picture Id must be a string",
    "string.guid": "Picture Id must be a valid UUID",
    "any.required": "Picture Id is required"
  }),
  
  name: Joi.string().empty("").required().messages({
    "string.base": "Name must be a string",
    "any.required": "Name is required"
  }),
  feePercentage: Joi.number().required().messages({
    "number.base": "Fee percentage must be a number",
    "any.required": "Fee percentage is required"
  }),
  arrivalInHours: Joi.number().positive().required().messages({
    "number.base": "ArrivalInHours must be a number",
    "any.required": "ArrivalInHours is required"
  }),
  type: Joi.string().empty("").valid('bank', 'jazzcash', 'epay', 'usdt', 'binance', 'easypaisa').required().messages({
        "any.only": "Type must be one of [bank, jazzcash, epay, usdt, binance, easypaisa]",
        "string.base": "Type must be a string",
        "any.required": "Type is required"
    }),
    country: Joi.string().empty("").required().messages({
      "string.base": "Country must be a string",
      "any.required": "Country is required"
    }),
});

module.exports = schema;