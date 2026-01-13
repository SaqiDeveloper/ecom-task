const Joi = require("joi");

const create = Joi.object({
  userId: Joi.string().uuid().optional().messages({
    "string.guid": "User ID must be a valid UUID",
  }),
  name: Joi.string().empty("").required().messages({
    "any.required": "Name is required",
  }),
  country: Joi.string().empty("").required().messages({
    "any.required": "Country is required",
  }),
  email: Joi.string().empty("").email().required().messages({
    "any.required": "Email is required",
    "string.email": "Email must be valid",
  }),
  phone: Joi.string().empty("").required().messages({
    "any.required": "Phone is required",
  }),
  user_name: Joi.string().optional().allow("").messages({
    "string.base": "User name must be a string",
  }),
  whatsapp: Joi.string().empty("").required().messages({
    "any.required": "WhatsApp number is required",
  }),
  password: Joi.string().empty("").required().messages({
    "any.required": "Password is required",
  }),
  bank_name: Joi.string().optional().allow("").messages({
    "string.base": "Bank name must be a string",
  }),
  bank_account_name: Joi.string().optional().allow("").messages({
    "string.base": "Bank account name must be a string",
  }),
  address: Joi.string().optional().allow("").messages({
    "string.base": "Address must be a string",
  }),
});


const update = Joi.object({
  name: Joi.string().empty("").required().messages({
    "any.required": "Name is required",
  }),
  phone: Joi.string().empty("").required().messages({
    "any.required": "Phone is required",
  }),

  whatsapp: Joi.string().empty("").required().messages({
    "any.required": "WhatsApp number is required",
  }),

});
const updateStatus = Joi.object({
  status: Joi.string().empty("").valid('Active', 'Blocked', 'Pending').required().messages({
    "any.required": "Status is required",
     "any.only": "Status must be one of Active, Blocked, Pending",
  }),
});

// send diamond
const sendDiamondByReseller = Joi.object({
  userCode: Joi.string().empty("").required().messages({
    "string.base": "userCode must be string",
    "any.required": "userCode is required",
  }),
  diamond: Joi.number().required().messages({
    "number.base": "diamond must be number",
    "any.required": "diamond is required",
  }),
  reason: Joi.string().optional().allow("").messages({
    "string.base": "reason must be string",
  }),
});

const requestFrameForUser = Joi.object({
  rid: Joi.string()
    .empty("") // Treat empty string as missing
    .pattern(/^\d+$/)
    .required()
    .messages({
      "string.base": "rid must be a string",
      "string.empty": "rid is required",
      "string.pattern.base": "rid must contain only digits",
      "any.required": "rid is required",
    }),

  buyDiamond: Joi.number().integer().positive().required().messages({
    "number.base": "buyDiamond must be a number",
    "number.integer": "buyDiamond must be an integer",
    "number.positive": "buyDiamond must be a positive number",
    "any.required": "buyDiamond is required",
  }),
  note: Joi.string()
    .empty("") 
    .optional()
    .allow("")
    .messages({
      "string.base": "note must be a string",
    }),
});

// frame status change
const FrameRequest = Joi.object({
  status: Joi.string().empty("").valid("active", "reject").required().messages({
    "any.only": "Status must be either 'active' or 'reject'",
    "any.required": "Status is required",
  }),

  reason: Joi.string().optional().allow("").messages({
    "string.base": "Reason must be a string",
  }),

  type: Joi.when("status", {
    is: "active",
    then: Joi.string()
      .valid("special_effect", "vip")
      .required()
      .empty("")
      .messages({
        "any.only": "Type must be either 'special_effect' or 'vip'",
        "any.empty": "Type is required when type is vip and status is active",
        "any.required":
          "Type is required when type is vip and status is active",
      }),
    otherwise: Joi.string().optional().allow("", null),
  }),

  productId: Joi.when("status", {
    is: "active",
    then: Joi.when("type", {
      is: "special_effect",
      then: Joi.string()
        .guid({ version: "uuidv4" })
        .required()
        .empty("")
        .messages({
          "string.guid": "productId must be a valid UUID",
          "string.base": "productId must be a string",
          "any.empty":
            "productId is required when type is special_effect and status is active",
          "any.required":
            "productId is required when type is special_effect and status is active",
        }),
      otherwise: Joi.string()
        .guid({ version: "uuidv4" })
        .optional()
        .allow("", null),
    }),
    otherwise: Joi.string()
      .guid({ version: "uuidv4" })
      .optional()
      .allow("", null),
  }),

  vipId: Joi.when("status", {
    is: "active",
    then: Joi.when("type", {
      is: "vip",
      then: Joi.string().guid({ version: "uuidv4" }).required().messages({
        "string.guid": "vipId must be a valid UUID",
        "string.base": "vipId must be a string",
        "any.required":
          "vipId is required when type is vip and status is active",
      }),
      otherwise: Joi.string()
        .guid({ version: "uuidv4" })
        .optional()
        .allow("", null),
    }),
    otherwise: Joi.string()
      .guid({ version: "uuidv4" })
      .optional()
      .allow("", null),
  }),

  duration: Joi.when("status", {
    is: "active",
    then: Joi.string().valid("7", "15", "30").required().messages({
      "any.only": "Duration must be one of 7, 15, or 30",
      "any.required": "Duration is required when status is active",
    }),
    otherwise: Joi.string().optional().allow("", null),
  }),
});
  

// updatte waiting request 
const updateWaitingRequest = Joi.object({
   status: Joi.string()
    .valid('waiting','decline','paid','done','paying','report')
    .optional()
    .messages({
      "string.base": "Status must be a string",
      "any.only": "Status must be one of 'pending', 'approved', 'waiting', 'decline', 'done', 'fail', 'refund'"
    }),

  reason: Joi.string()
    .when('status', {
      is: 'decline',
      then: Joi.required().messages({
        "any.required": "Reason is required when status is decline",
        "string.base": "Reason must be a string"
      }),
      otherwise: Joi.optional().allow('')
    })
}) 

const updatePassword = Joi.object({
  oldPassword: Joi.string().empty("").required().messages({
    "any.required": "Old password is required",
    "string.base": "Old password must be a string"
  }),

  newPassword: Joi.string().empty("").min(8).required().messages({
    "any.required": "New password is required",
    "string.min": "New password must be at least 8 characters",
    "string.base": "New password must be a string"
  }),

  confirmPassword: Joi.string().required().empty("").valid(Joi.ref('newPassword')).messages({
    "any.required": "Confirm password is required",
    "any.only": "Confirm password must match with new password",
    "string.base": "Confirm password must be a string"
  })
});

module.exports = {
  create,
  update,
  updateStatus,
  sendDiamondByReseller,
  requestFrameForUser,
  FrameRequest,
  updateWaitingRequest,
  updatePassword,
};
