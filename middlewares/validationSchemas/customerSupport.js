const Joi = require("joi");

const create = Joi.object({
  name: Joi.string().empty("").required().messages({
    "any.required": "Name is required",
  }),

  email: Joi.string().empty("").email().required().messages({
    "any.required": "Email is required",
    "string.email": "Email must be valid",
  }),
  phone: Joi.string().empty("").required().messages({
    "any.required": "Phone is required",
  }),
  password: Joi.string().empty("").required().messages({
    "any.required": "Password is required",
  }),
  file: Joi.string().allow("").optional("").messages({}),
  technicalRole: Joi.string()
    .valid(
      "technical_issues",
      "business_developer_support",
      "payments_billing",
      "account_profile",
      "rewards_referrals",
      "app_features_suggestions",
      "terms_policies_legal",
      "regional_language_support",
      "general_queries"
    )
    .empty("")
    .required()
    .messages({
      "any.required": "Technical role is required.",
      "string.empty": "Technical role cannot be empty.",
      "any.only": "Technical role must be one of the predefined values.",
      "string.base": "Technical role must be a valid string.",
    }),
});

const update = Joi.object({
  name: Joi.string().empty("").required().messages({
    "any.required": "Name is required",
  }),

  email: Joi.string().allow("").email().optional().messages({
    "string.base": "Email must be a string",
    "string.email": "Email must be valid",
  }),
  phone: Joi.string().allow("").optional().messages({
    "string.base": "Phone must be a string",
  }),
  password: Joi.string().allow("").optional().messages({
    "string.base": "Password must be a string",
  }),

  file: Joi.string().allow("").optional("").messages({}),
  technicalRole: Joi.string()
    .valid(
      "technical_issues",
      "business_developer_support",
      "payments_billing",
      "account_profile",
      "rewards_referrals",
      "app_features_suggestions",
      "terms_policies_legal",
      "regional_language_support",
      "general_queries"
    )
    .empty("")
    .required()
    .messages({
      "any.required": "Technical role is required.",
      "string.empty": "Technical role cannot be empty.",
      "any.only": "Technical role must be one of the predefined values.",
      "string.base": "Technical role must be a valid string.",
    }),
});

const updateStatus = Joi.object({
  status: Joi.boolean().required().messages({
    "any.required": "Status is required",
  }),
});

const login = Joi.object({
  email: Joi.string().email().empty("").required().messages({
    "any.required": "Email is required",
    "string.email": "Email must be a valid email",
    "string.base": "Email must be a string",
  }),

  password: Joi.string().empty("").required().messages({
    "any.required": "Password is required",
    "string.base": "Password must be a string",
  }),
});

module.exports = {
  create,
  update,
  updateStatus,
  login,
};
