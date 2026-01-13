'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BusinessUser extends Model {
    static associate(models) {
      // BusinessUser belongs to a User
      BusinessUser.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });

      // BusinessUser belongs to a Business
      BusinessUser.belongsTo(models.Business, {
        foreignKey: 'businessId',
        as: 'business'
      });
    }
  }

  BusinessUser.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      businessId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('Owner', 'staff'),
        allowNull: false,
        defaultValue: 'staff'
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'BusinessUser',
      tableName: 'businessUsers',
      timestamps: true,   
      paranoid: true,   
    }
  );

  return BusinessUser;
};
