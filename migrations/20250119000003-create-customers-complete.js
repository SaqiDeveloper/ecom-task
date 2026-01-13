'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create customers table with all features
    await queryInterface.createTable('customers', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        allowNull: false,
        primaryKey: true,
      },
      businessId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'businesses',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      customerType: {
        type: Sequelize.ENUM('walk-in', 'regular', 'vip'),
        defaultValue: 'walk-in',
        allowNull: false,
      },
      totalOrders: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      totalSpent: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.00,
        allowNull: false,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Add indexes for better performance
    await queryInterface.addIndex('customers', ['businessId']);
    await queryInterface.addIndex('customers', ['email']);
    await queryInterface.addIndex('customers', ['phone']);
    await queryInterface.addIndex('customers', ['customerType']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('customers');
  }
};
