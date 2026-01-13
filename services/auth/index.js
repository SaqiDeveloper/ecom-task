const bcrypt = require("bcrypt");
const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const { STATUS_CODES, TEXTS } = require("../../config/constants");
const { generateToken } = require("../../utils/jwtToken");
const { User, Business, BusinessUser } = require('../../models');
const { isSuperAdmin } = require("../../middlewares/admin.middleware");


const login = asyncErrorHandler(async (req, res) => {

  const user = await User.findOne({
    where: { email: req.body.email },
    attributes: ["id", "name", "email","isSuperAdmin"],
    include: [
      {
        model: Business,
        as: "businesses",
        attributes: ["id", "businessName", "picture"],
        through: {
          attributes: ["role", "isActive"],
          where: { isActive: true }
        },
      },
    ],
  });
  if (user) {
    // const { password, ...rest } = response;
    // const isTrue = bcrypt.compareSync(req.body?.password, password);
    const accessToken = generateToken(user.get({ plain: true }));
    res.status(STATUS_CODES.SUCCESS).json({
      statusCode: STATUS_CODES.SUCCESS,
      message: TEXTS.LOGIN,
      data: user.get({ plain: true }),
      accessToken: accessToken,
    });
  } else {
    res.status(STATUS_CODES.UNAUTHORIZED).json({
      statusCode: STATUS_CODES.UNAUTHORIZED,
      message: TEXTS.UN_AUTHORIZED,
    });
  }

});


const adminLogin = asyncErrorHandler(async (req, res) => {

  const user = await User.findOne({
    where: { email: req.body.email , isSuperAdmin : true },
    attributes: ["id", "name", "email","isSuperAdmin"],
    include: [
      {
        model: Business,
        as: "businesses",
        attributes: ["id", "businessName", "picture"],
        through: {
          attributes: ["role", "isActive"],
          where: { isActive: true }
        },
      },
    ],
  });
  if (user) {
    // const { password, ...rest } = response;
    // const isTrue = bcrypt.compareSync(req.body?.password, password);
    const accessToken = generateToken(user.get({ plain: true }));
    res.status(STATUS_CODES.SUCCESS).json({
      statusCode: STATUS_CODES.SUCCESS,
      message: TEXTS.LOGIN,
      data: user.get({ plain: true }),
      accessToken: accessToken,
    });
  } else {
    res.status(STATUS_CODES.UNAUTHORIZED).json({
      statusCode: STATUS_CODES.UNAUTHORIZED,
      message: TEXTS.UN_AUTHORIZED,
    });
  }

});


module.exports = {
  login,
  adminLogin
};
