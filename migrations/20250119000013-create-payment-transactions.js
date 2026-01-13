'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create payment transactions table
    await queryInterface.createTable('paymentTransactions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        allowNull: false,
        primaryKey: true,
      },
      orderId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
      transactionNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        comment: 'Unique transaction reference number'
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Payment amount'
      },
      paymentMethod: {
        type: Sequelize.ENUM('cash', 'card', 'digital', 'bank_transfer', 'cheque'),
        allowNull: false,
        comment: 'Method of payment'
      },
      paymentType: {
        type: Sequelize.ENUM('full_payment', 'partial_payment', 'advance_payment', 'final_payment'),
        allowNull: false,
        defaultValue: 'full_payment',
        comment: 'Type of payment'
      },
      status: {
        type: Sequelize.ENUM('pending', 'completed', 'failed', 'refunded'),
        allowNull: false,
        defaultValue: 'completed',
        comment: 'Transaction status'
      },
      processedBy: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Payment notes or reference'
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
    await queryInterface.addIndex('paymentTransactions', ['orderId']);
    await queryInterface.addIndex('paymentTransactions', ['businessId']);
    await queryInterface.addIndex('paymentTransactions', ['customerId']);
    await queryInterface.addIndex('paymentTransactions', ['transactionNumber']);
    await queryInterface.addIndex('paymentTransactions', ['status']);
    await queryInterface.addIndex('paymentTransactions', ['createdAt']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('paymentTransactions');
  }
};
