const router = require("express").Router();
const productService = require("../../services/product");
const variantService = require("../../services/productVariants");

router.post("/product", productService.createProduct);
router.get("/product/:productId", productService.getProduct);
router.get("/product", productService.getAllProducts);
router.patch("/product/:productId", productService.updateProduct);
router.delete("/product/:productId", productService.deleteProduct);


router.post("/product/variant/:productId", variantService.createVariant);
router.get("/product/variant/all", variantService.getAllVariants);
router.get("/product/variant/:productId", variantService.getVariant);
router.get("/product/variant", variantService.getAllVariants);
router.patch("/product/variant/:variantId", variantService.updateVariant);
router.delete("/product/variant/:variantId", variantService.deleteVariant);


module.exports = router;