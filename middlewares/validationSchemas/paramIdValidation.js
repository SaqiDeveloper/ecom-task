const Joi = require("joi");

const IdParamsValidation = Joi.object({
  id: Joi.string().uuid().required().messages({
    "string.guid": "Id must be a valid UUID.",
    "any.required": "Id is required in params.",
  }),
});
const agencyIdParamsValidation = Joi.object({
  agencyId: Joi.string().uuid().required().messages({
    "string.guid": "AgencyId must be a valid UUID.",
    "any.required": "AgencyId is required in params.",
  }),
});

const userIdParamsValidation = Joi.object({
  userId: Joi.string().uuid().required().messages({
    "string.guid": "User Id must be a valid UUID.",
    "any.required": "User Id required in params.",
  }),
});

const hostIdParamsValidation = Joi.object({
  hostId: Joi.string().uuid().required().messages({
    "string.guid": "Host Id must be a valid UUID.",
    "any.required": "Host Id is required in params.",
  }),
});

module.exports = {
  IdParamsValidation,
  agencyIdParamsValidation,
  userIdParamsValidation,
  hostIdParamsValidation,
};
