const stockService = require('../../services/stock');

module.exports = {
    getAllStockItems: stockService.getAllStockItems,
    updateProductStock: stockService.updateProductStock,
    updateVariantStock: stockService.updateVariantStock,
    getStockStats: stockService.getStockStats,
    getLowStockAlerts: stockService.getLowStockAlerts
};
