const Joi = require("joi");

const userTagSchema = Joi.object({
  userRid: Joi.string().required().messages({
    "any.required": "User RID is required.",
    "string.empty": "User RID cannot be empty.",
  }),

  tagId: Joi.string()
    .guid({ version: "uuidv4" })
    .optional()
    .allow(null)
    .messages({
      "string.guid": "Tag ID must be a valid UUID.",
    }),

  status: Joi.boolean().messages({
    "boolean.base": "Status must be a boolean value.",
    "string.empty": "Status cannot be empty.",
  }),
});

module.exports = userTagSchema;
