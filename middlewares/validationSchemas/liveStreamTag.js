const Joi = require("joi");

const liveStreamTag = Joi.object({
  tagName: Joi.string().required(),
  // picture: Joi.string().required(),
  sortOrder: Joi.number().required()
});

module.exports = liveStreamTag;
