'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class customers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      customers.belongsTo(models.Business, {
        foreignKey: 'businessId',
        as: 'Business'
      });
      
      customers.hasMany(models.orders, {
        foreignKey: 'customerId',
        as: 'Orders'
      });
      
      customers.hasMany(models.returns, {
        foreignKey: 'customerId',
        as: 'Returns'
      });
    }
  }
  customers.init({
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
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    customerType: {
      type: DataTypes.ENUM('walk-in', 'regular', 'vip'),
      defaultValue: 'walk-in',
      allowNull: false,
    },
    totalOrders: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    totalSpent: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'customers',
    tableName: 'customers',
  });
  return customers;
};
