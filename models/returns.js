'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class returns extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      returns.belongsTo(models.Business, {
        foreignKey: 'businessId',
        as: 'Business'
      });
      
      returns.belongsTo(models.orders, {
        foreignKey: 'orderId',
        as: 'Order'
      });
      
      returns.belongsTo(models.orderItems, {
        foreignKey: 'orderItemId',
        as: 'OrderItem'
      });
      
      returns.belongsTo(models.customers, {
        foreignKey: 'customerId',
        as: 'Customer'
      });
      
      returns.belongsTo(models.User, {
        foreignKey: 'processedBy',
        as: 'ProcessedBy'
      });
    }
  }
  returns.init({
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
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    orderItemId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    returnNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    processedBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    returnType: {
      type: DataTypes.ENUM('return', 'exchange', 'refund'),
      allowNull: false,
    },
    returnReason: {
      type: DataTypes.ENUM('defective', 'wrong_item', 'not_satisfied', 'size_issue', 'other'),
      allowNull: false,
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
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    refundAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    refundMethod: {
      type: DataTypes.ENUM('cash', 'card', 'store_credit', 'original_payment'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'completed'),
      defaultValue: 'pending',
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    processedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'returns',
    tableName: 'returns',
  });
  return returns;
};
