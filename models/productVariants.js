'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class productVariants extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      productVariants.belongsTo(models.products, {
        foreignKey: 'productId',
        as: 'Product'
      });
    }
  }
  productVariants.init({

    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.literal("gen_random_uuid()"),
      allowNull: false,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      defaultValue: Sequelize.literal(`'SKU-' || nextval('product_variant_sku_seq')`)
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0.00
    },
    stock: {
      type: DataTypes.INTEGER
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    attributes: {
      type: DataTypes.JSONB,
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
    },
  }, {
    sequelize,
    modelName: 'productVariants',
  });
  return productVariants;
};