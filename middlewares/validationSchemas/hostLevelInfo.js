const Joi = require('joi');

const hostLevelInfo = Joi.object({
  level: Joi.string()
    .trim()
    .required()
    .messages({ 'any.required': 'Level must be required.' })
    .custom((value, helpers) => {
      if (value === '') {
        return helpers.error('any.required'); // Use only error code
      }
      if (isNaN(value)) {
        return helpers.error('number.base'); // Use only error code
      }
      if (Number(value) <= 0) {
        return helpers.error('number.positive'); // Use only error code
      }
      return Number(value); // Convert to number
    })
    .messages({ 
      'number.base': 'Level must be a number.', 
      'number.positive': 'Level must be a positive number.' 
    }),

  rcoin: Joi.string()
    .trim()
    .required()
    .messages({ 'any.required': 'Rcoin must be required.' })
    .custom((value, helpers) => {
      if (value === '') {
        return helpers.error('any.required'); // Use only error code
      }
      if (isNaN(value)) {
        return helpers.error('number.base'); // Use only error code
      }
      if (Number(value) < 0) {
        return helpers.error('number.positive'); // Use only error code
      }
      return Number(value); // Convert to number
    })
    .messages({ 
      'number.base': 'Rcoin must be a number.', 
      'number.positive': 'Rcoin must be a positive number.' 
    }),

  file: Joi.string().optional().allow(''),
});

module.exports = hostLevelInfo;
