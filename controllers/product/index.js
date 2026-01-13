const router = require("express").Router();
const productService = require("../../services/product");
const variantService = require("../../services/productVariants");

router.post("/product/:businessId/:categoryId", productService.createProduct);
router.get("/product/:businessId/:categoryId", productService.getProduct);
router.get("/product/:businessId", productService.getAllProducts);
router.patch("/product/:businessId/:productId", productService.updateProduct);
router.delete("/product/:businessId/:productId", productService.deleteProduct);


router.post("/product/variant/:businessId/:categoryId/:productId", variantService.createVariant);
router.get("/product/variant/all/:businessId", variantService.getAllVariants);
router.get("/product/variant/:businessId/:productId", variantService.getVariant);
router.get("/product/variant/:businessId", variantService.getAllVariants);
router.patch("/product/variant/:businessId/:variantId", variantService.updateVariant);
router.delete("/product/variant/:businessId/:variantId", variantService.deleteVariant);


module.exports = router;