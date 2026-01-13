'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class paymentTransactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      paymentTransactions.belongsTo(models.orders, {
        foreignKey: 'orderId',
        as: 'Order'
      });
      
      paymentTransactions.belongsTo(models.Business, {
        foreignKey: 'businessId',
        as: 'Business'
      });
      
      paymentTransactions.belongsTo(models.customers, {
        foreignKey: 'customerId',
        as: 'Customer'
      });
      
      paymentTransactions.belongsTo(models.User, {
        foreignKey: 'processedBy',
        as: 'ProcessedBy'
      });
    }
  }
  paymentTransactions.init({
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
    businessId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    transactionNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.ENUM('cash', 'card', 'digital', 'bank_transfer', 'cheque'),
      allowNull: false,
    },
    paymentType: {
      type: DataTypes.ENUM('full_payment', 'partial_payment', 'advance_payment', 'final_payment'),
      allowNull: false,
      defaultValue: 'full_payment',
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
      allowNull: false,
      defaultValue: 'completed',
    },
    processedBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'paymentTransactions',
    tableName: 'paymentTransactions',
  });
  return paymentTransactions;
};
