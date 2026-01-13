const joi = require("joi");

const schema = joi.object({
    giftId: joi.string().uuid().empty("").required().messages({
        "string.base": "giftId must be a string",
        "string.guid": "giftId must be a valid UUID",
        "any.required": "giftId is required"
    }),
    roomId: joi.string().empty("").required().messages({
        "string.base": "roomId must be a string",
        "any.required": "roomId is required"
    }),

    type: joi.string().valid('audio', 'video').empty("").required().messages({
        "string.base": "type must be a string",
        "any.only": "type must be either 'audio' or 'video'",
        "any.required": "type is required"
    }),
});

module.exports = schema;