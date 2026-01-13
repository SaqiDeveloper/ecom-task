const router = require("express").Router();
const productService = require("../../services/product");
const variantService = require("../../services/productVariants");
const { isSuperAdmin } = require("../../middlewares/admin.middleware");

// Swagger documentation is in swagger/paths/products.js and swagger/paths/variants.js

// Products routes
router.post("/product", isSuperAdmin, productService.createProduct);
router.get("/product/:productId", productService.getProduct);
router.get("/product", productService.getAllProducts);
router.patch("/product/:productId", isSuperAdmin, productService.updateProduct);
router.delete("/product/:productId", isSuperAdmin, productService.deleteProduct);

// Product Variants routes
router.post("/product/variant/:productId", isSuperAdmin, variantService.createVariant);
router.get("/product/variant/all", variantService.getAllVariants);
router.get("/product/variant/:productId", variantService.getVariant);
router.get("/product/variant", variantService.getAllVariants);
router.patch("/product/variant/:variantId", isSuperAdmin, variantService.updateVariant);
router.delete("/product/variant/:variantId", isSuperAdmin, variantService.deleteVariant);

module.exports = router;
