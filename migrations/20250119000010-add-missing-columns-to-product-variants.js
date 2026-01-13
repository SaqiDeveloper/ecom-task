'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add missing columns to productVariants table
    await queryInterface.addColumn('productVariants', 'businessId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'businesses',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    // Add indexes for the new columns
    await queryInterface.addIndex('productVariants', ['businessId']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('productVariants', ['businessId']);
    await queryInterface.removeColumn('productVariants', 'businessId');
  }
};
