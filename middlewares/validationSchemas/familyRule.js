const Joi = require("joi");

const schema = Joi.object({
  level: Joi.number().required().messages({
    "number.base": "level must be a number",
    "any.required": "level is required",
  }),
  score: Joi.number().required().messages({
    "number.base": "score must be a number",
    "any.required": "score is required",
  }),
  frameForOwner: Joi.string().required().messages({
    "string.base": "frameForOwner must be a string",
    "any.required": "frameForOwner is required",
  }),
  notificationAllBroad: Joi.string().required().messages({
    "string.base": "notificationAllBroad must be a string",
    "any.required": "notificationAllBroad is required",
  }),
  familyTopScore: Joi.string().required().messages({
    "string.base": "familyTopScore must be a string",
    "any.required": "familyTopScore is required",
  }),
  entriesEffectSvg: Joi.string().required().messages({
    "string.base": "entriesEffectSvg must be a string",
    "any.required": "entriesEffectSvg is required",
  }),
  frameForTopScorers: Joi.number().required().messages({
    "number.base": "frameForTopScorers must be a number",
    "any.required": "frameForTopScorers is required",
  }),
  freeVoiceNoteForFamilyOwner: Joi.number().required().messages({
    "number.base": "freeVoiceNoteForFamilyOwner must be a number",
    "any.required": "freeVoiceNoteForFamilyOwner is required",
  }),
  publicBulletMessageForFamilyOwner: Joi.number().required().messages({
    "number.base": "publicBulletMessageForFamilyOwner must be a number",
    "any.required": "publicBulletMessageForFamilyOwner is required",
  }),
  bulletMessageForFamilyOwner: Joi.number().required().messages({
    "number.base": "bulletMessageForFamilyOwner must be a number",
    "any.required": "bulletMessageForFamilyOwner is required",
  }),
});

module.exports = schema;
