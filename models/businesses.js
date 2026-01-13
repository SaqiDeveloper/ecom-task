'use strict';
const { Model, DataTypes, Sequelize } = require('sequelize');

module.exports = (sequelize) => {
  class Business extends Model {
    static associate(models) {
      // future associations yahan define karenge
      // Business.hasMany(models.User, { foreignKey: 'businessId' });
      Business.hasMany(models.BusinessUser, { foreignKey: 'businessId', as: 'businessUsers' });

      Business.belongsToMany(models.User, {
        through: models.BusinessUser,
        as: "users",
        foreignKey: "businessId",
      });

    }
  }

  Business.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.literal("gen_random_uuid()"),
      allowNull: false,
      primaryKey: true,
    },
    businessName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    picture: {
      type: DataTypes.STRING,
    }

    
  }, {
    sequelize,
    modelName: 'Business',
    tableName: 'businesses',
    timestamps: true,
    paranoid: true
  });

  // 👇 Hook for cascading soft delete
  Business.addHook('afterDestroy', async (business, options) => {
    const { BusinessUser } = sequelize.models;
    await BusinessUser.destroy({
      where: { businessId: business.id },
      individualHooks: true,
    });
  });

  return Business;
};
