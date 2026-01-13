'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add partial payment fields to orders table
    await queryInterface.addColumn('orders', 'paidAmount', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      comment: 'Amount paid by customer'
    });

    await queryInterface.addColumn('orders', 'remainingAmount', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      comment: 'Remaining amount to be paid'
    });

    await queryInterface.addColumn('orders', 'isFullyPaid', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether order is fully paid'
    });

    await queryInterface.addColumn('orders', 'paymentDueDate', {
      type: Sequelize.DATE,
      allowNull: true,
      comment: 'Due date for remaining payment'
    });

    await queryInterface.addColumn('orders', 'paymentNotes', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Notes about payment terms'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('orders', 'paidAmount');
    await queryInterface.removeColumn('orders', 'remainingAmount');
    await queryInterface.removeColumn('orders', 'isFullyPaid');
    await queryInterface.removeColumn('orders', 'paymentDueDate');
    await queryInterface.removeColumn('orders', 'paymentNotes');
  }
};
