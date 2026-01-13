const router = require("express").Router();
const cartService = require("../../services/cart");

// Swagger documentation is in swagger/paths/cart.js

router.get("/cart", cartService.getOrCreateCart);
router.post("/cart/item", cartService.addItemToCart);
router.patch("/cart/item/:itemId", cartService.updateCartItem);
router.delete("/cart/item/:itemId", cartService.removeCartItem);
router.delete("/cart/clear", cartService.clearCart);

module.exports = router;

