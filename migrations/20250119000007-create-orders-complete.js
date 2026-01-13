'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create orders table with all features
    await queryInterface.createTable('orders', {
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
      customerId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'customers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      orderNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      cashierId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      customerName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      customerType: {
        type: Sequelize.ENUM('walk-in', 'regular', 'vip'),
        defaultValue: 'walk-in',
        allowNull: false,
      },
      subtotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
      },
      taxAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
      },
      taxRate: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 8.00,
      },
      totalAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
      },
      paymentMethod: {
        type: Sequelize.ENUM('cash', 'card', 'digital', 'mixed'),
        defaultValue: 'cash',
        allowNull: false,
      },
      paymentStatus: {
        type: Sequelize.ENUM('pending', 'paid', 'refunded', 'partially_refunded'),
        defaultValue: 'paid',
        allowNull: false,
      },
      orderStatus: {
        type: Sequelize.ENUM('pending', 'processing', 'completed', 'cancelled', 'refunded'),
        defaultValue: 'completed',
        allowNull: false,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
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
    await queryInterface.addIndex('orders', ['businessId']);
    await queryInterface.addIndex('orders', ['customerId']);
    await queryInterface.addIndex('orders', ['cashierId']);
    await queryInterface.addIndex('orders', ['orderNumber']);
    await queryInterface.addIndex('orders', ['orderStatus']);
    await queryInterface.addIndex('orders', ['paymentStatus']);
    await queryInterface.addIndex('orders', ['createdAt']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('orders');
  }
};
