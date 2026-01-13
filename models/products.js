'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      products.hasMany(models.productVariants, {
        foreignKey: 'productId',
        as: 'Variants'
      });
      products.belongsTo(models.Business, {
        foreignKey: 'businessId',
        as: 'Business'
      });
    }
  }
  products.init({

    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.literal("gen_random_uuid()"),
      allowNull: false,
      primaryKey: true,
    },
     businessId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    desc: {
      type: DataTypes.STRING
    },
    isVariable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0.00
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    purchasePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00,
      comment: 'Cost price for profit calculation'
    },
    profitMargin: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: 'Profit margin percentage'
    }
  },

    {
      sequelize,
      modelName: 'products',
    });
  return products;
};