'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class orderItems extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      orderItems.belongsTo(models.orders, {
        foreignKey: 'orderId',
        as: 'Order'
      });
      
      orderItems.belongsTo(models.products, {
        foreignKey: 'productId',
        as: 'Product'
      });
      
      orderItems.belongsTo(models.productVariants, {
        foreignKey: 'variantId',
        as: 'Variant'
      });
      
      orderItems.hasMany(models.returns, {
        foreignKey: 'orderItemId',
        as: 'Returns'
      });
    }
  }
  orderItems.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.literal("gen_random_uuid()"),
      allowNull: false,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    variantId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    variantName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    discountAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    discountPercentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0.00,
    }
  }, {
    sequelize,
    modelName: 'orderItems',
    tableName: 'order_items',
  });
  return orderItems;
};
