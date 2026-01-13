const Joi = require('joi');

const sender_level_info = Joi.object({
  level:  Joi.string()
      .trim()
      .required()
      .messages({ 'any.required': 'level must be required.' })
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
        'number.base': 'level must be a number.', 
        'number.positive': 'level must be a positive number.' 
      }),

  diamond: Joi.string()
      .trim()
      .required()
      .messages({ 'any.required': 'Diamond must be required.' })
      .custom((value, helpers) => {
        if (value === '') {
          return helpers.error('any.required'); 
        }
        if (isNaN(value)) {
          return helpers.error('number.base'); 
        }
        if (Number(value) <= 0) {
          return helpers.error('number.positive'); 
        }
        return Number(value); 
      })
      .messages({ 
        'number.base': 'Diamond must be a number.', 
        'number.positive': 'Diamond must be a positive number.' 
      }),

  file: Joi.string().optional().allow(''),
});

module.exports = sender_level_info;
