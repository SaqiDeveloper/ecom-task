// utils/withTransaction.js
const { sequelize } = require('../models');

const withTransaction = async (callback) => {
    const t = await sequelize.transaction();
    try {
        const result = await callback(t);
        await t.commit();
        return result;
    } catch (err) {
        await t.rollback();
        throw err; // asyncErrorHandler catch kar lega
    }
}

module.exports = withTransaction;
