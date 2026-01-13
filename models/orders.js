'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      orders.belongsTo(models.Business, {
        foreignKey: 'businessId',
        as: 'Business'
      });
      
      orders.belongsTo(models.customers, {
        foreignKey: 'customerId',
        as: 'Customer'
      });
      
      orders.belongsTo(models.User, {
        foreignKey: 'cashierId',
        as: 'Cashier'
      });
      
      orders.hasMany(models.orderItems, {
        foreignKey: 'orderId',
        as: 'OrderItems'
      });
      
      orders.hasMany(models.returns, {
        foreignKey: 'orderId',
        as: 'Returns'
      });
    }
  }
  orders.init({
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
    customerId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    orderNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    cashierId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerType: {
      type: DataTypes.ENUM('walk-in', 'regular', 'vip'),
      defaultValue: 'walk-in',
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    taxAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    taxRate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 8.00,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    paymentMethod: {
      type: DataTypes.ENUM('cash', 'card', 'digital', 'mixed'),
      defaultValue: 'cash',
      allowNull: false,
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'paid', 'refunded', 'partially_refunded'),
      defaultValue: 'paid',
      allowNull: false,
    },
    orderStatus: {
      type: DataTypes.ENUM('pending', 'processing', 'completed', 'cancelled', 'refunded'),
      defaultValue: 'completed',
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    paidAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      comment: 'Amount paid by customer'
    },
    remainingAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      comment: 'Remaining amount to be paid'
    },
    isFullyPaid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether order is fully paid'
    },
    paymentDueDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Due date for remaining payment'
    },
    paymentNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Notes about payment terms'
    }
  }, {
    sequelize,
    modelName: 'orders',
    tableName: 'orders',
  });
  return orders;
};
