'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create enum types first
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_returns_returnType" AS ENUM('return', 'exchange', 'refund');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_returns_refundMethod" AS ENUM('original_payment', 'cash', 'store_credit');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_returns_status" AS ENUM('pending', 'approved', 'rejected', 'completed');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create returns table with all features
    await queryInterface.createTable('returns', {
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
      orderItemId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'order_items',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      returnNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
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
      returnType: {
        type: Sequelize.ENUM('return', 'exchange', 'refund'),
        defaultValue: 'return',
        allowNull: false,
      },
      returnReason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      unitPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
      },
      totalAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
      },
      refundAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
      },
      refundMethod: {
        type: Sequelize.ENUM('original_payment', 'cash', 'store_credit'),
        defaultValue: 'original_payment',
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected', 'completed'),
        defaultValue: 'pending',
        allowNull: false,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      processedAt: {
        type: Sequelize.DATE,
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
    await queryInterface.addIndex('returns', ['businessId']);
    await queryInterface.addIndex('returns', ['orderId']);
    await queryInterface.addIndex('returns', ['orderItemId']);
    await queryInterface.addIndex('returns', ['customerId']);
    await queryInterface.addIndex('returns', ['processedBy']);
    await queryInterface.addIndex('returns', ['returnNumber']);
    await queryInterface.addIndex('returns', ['status']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('returns');
  }
};
