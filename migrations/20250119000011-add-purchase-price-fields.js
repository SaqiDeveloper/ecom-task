'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add purchase price to products table
    await queryInterface.addColumn('products', 'purchasePrice', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00,
      comment: 'Cost price for profit calculation'
    });

    // Add purchase price to productVariants table
    await queryInterface.addColumn('productVariants', 'purchasePrice', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00,
      comment: 'Cost price for profit calculation'
    });

    // Add profit margin calculation columns to products
    await queryInterface.addColumn('products', 'profitMargin', {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: true,
      comment: 'Profit margin percentage'
    });

    // Add profit margin calculation columns to productVariants
    await queryInterface.addColumn('productVariants', 'profitMargin', {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: true,
      comment: 'Profit margin percentage'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('products', 'purchasePrice');
    await queryInterface.removeColumn('productVariants', 'purchasePrice');
    await queryInterface.removeColumn('products', 'profitMargin');
    await queryInterface.removeColumn('productVariants', 'profitMargin');
  }
};
