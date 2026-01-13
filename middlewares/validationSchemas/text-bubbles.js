const joi = require("joi")

const schema = joi.object({
    pictureUrl:joi.string().messages({
        "string.base":"picture url must be string"
    }),
})

module.exports = schema;