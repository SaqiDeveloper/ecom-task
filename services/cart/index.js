const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const { STATUS_CODES } = require("../../config/constants");
const { carts, cartItems, products, productVariants } = require('../../models');
const { Op } = require('sequelize');
const Sequelize = require('sequelize');

// Get or create active cart for user
const getOrCreateCart = asyncErrorHandler(async (req, res) => {
    const userId = req.user.id;

    let cart = await carts.findOne({
        where: {
            userId: userId,
            status: 'active'
        },
        include: [{
            model: cartItems,
            as: 'CartItems',
            include: [
                {
                    model: products,
                    as: 'Product'
                },
                {
                    model: productVariants,
                    as: 'Variant',
                    required: false
                }
            ]
        }]
    });

    if (!cart) {
        cart = await carts.create({
            userId: userId,
            status: 'active',
            totalAmount: 0.00
        });
    }

    res.status(STATUS_CODES.SUCCESS).json({
        statusCode: STATUS_CODES.SUCCESS,
        message: "Cart fetched successfully",
        data: cart
    });
});

// Add item to cart
const addItemToCart = asyncErrorHandler(async (req, res) => {
    const userId = req.user.id;
    const { productId, variantId, quantity } = req.body;

    // Get or create cart
    let cart = await carts.findOne({
        where: {
            userId: userId,
            status: 'active'
        }
    });

    if (!cart) {
        cart = await carts.create({
            userId: userId,
            status: 'active',
            totalAmount: 0.00
        });
    }

    // Validate product
    const product = await products.findByPk(productId);
    if (!product) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode: STATUS_CODES.NOT_FOUND,
            message: "Product not found"
        });
    }

    // Validate variant if provided
    let variant = null;
    let itemPrice = product.price || 0.00;

    if (variantId) {
        variant = await productVariants.findOne({
            where: {
                id: variantId,
                productId: productId
            }
        });

        if (!variant) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                statusCode: STATUS_CODES.NOT_FOUND,
                message: "Variant not found for this product"
            });
        }
        itemPrice = variant.price;
    }

    // Check if item already exists in cart
    const existingItem = await cartItems.findOne({
        where: {
            cartId: cart.id,
            productId: productId,
            variantId: variantId || null
        }
    });

    let cartItem;
    if (existingItem) {
        // Update quantity
        existingItem.quantity += quantity || 1;
        existingItem.subtotal = existingItem.quantity * itemPrice;
        await existingItem.save();
        cartItem = existingItem;
    } else {
        // Create new item
        const qty = quantity || 1;
        cartItem = await cartItems.create({
            cartId: cart.id,
            productId: productId,
            variantId: variantId || null,
            quantity: qty,
            price: itemPrice,
            subtotal: qty * itemPrice
        });
    }

    // Update cart total
    await updateCartTotal(cart.id);

    res.status(STATUS_CODES.SUCCESS).json({
        statusCode: STATUS_CODES.SUCCESS,
        message: "Item added to cart successfully",
        data: cartItem
    });
});

// Update cart item quantity
const updateCartItem = asyncErrorHandler(async (req, res) => {
    const userId = req.user.id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            statusCode: STATUS_CODES.BAD_REQUEST,
            message: "Quantity must be at least 1"
        });
    }

    // Find cart item and verify it belongs to user's cart
    const cartItem = await cartItems.findOne({
        where: { id: itemId },
        include: [{
            model: carts,
            as: 'Cart',
            where: {
                userId: userId,
                status: 'active'
            }
        }]
    });

    if (!cartItem) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode: STATUS_CODES.NOT_FOUND,
            message: "Cart item not found"
        });
    }

    cartItem.quantity = quantity;
    cartItem.subtotal = quantity * cartItem.price;
    await cartItem.save();

    // Update cart total
    await updateCartTotal(cartItem.cartId);

    res.status(STATUS_CODES.SUCCESS).json({
        statusCode: STATUS_CODES.SUCCESS,
        message: "Cart item updated successfully",
        data: cartItem
    });
});

// Remove item from cart
const removeCartItem = asyncErrorHandler(async (req, res) => {
    const userId = req.user.id;
    const { itemId } = req.params;

    // Find cart item and verify it belongs to user's cart
    const cartItem = await cartItems.findOne({
        where: { id: itemId },
        include: [{
            model: carts,
            as: 'Cart',
            where: {
                userId: userId,
                status: 'active'
            }
        }]
    });

    if (!cartItem) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode: STATUS_CODES.NOT_FOUND,
            message: "Cart item not found"
        });
    }

    const cartId = cartItem.cartId;
    await cartItem.destroy();

    // Update cart total
    await updateCartTotal(cartId);

    res.status(STATUS_CODES.SUCCESS).json({
        statusCode: STATUS_CODES.SUCCESS,
        message: "Item removed from cart successfully"
    });
});

// Clear cart
const clearCart = asyncErrorHandler(async (req, res) => {
    const userId = req.user.id;

    const cart = await carts.findOne({
        where: {
            userId: userId,
            status: 'active'
        }
    });

    if (!cart) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode: STATUS_CODES.NOT_FOUND,
            message: "Cart not found"
        });
    }

    await cartItems.destroy({
        where: { cartId: cart.id }
    });

    cart.totalAmount = 0.00;
    await cart.save();

    res.status(STATUS_CODES.SUCCESS).json({
        statusCode: STATUS_CODES.SUCCESS,
        message: "Cart cleared successfully"
    });
});

// Helper function to update cart total
const updateCartTotal = async (cartId) => {
    const result = await cartItems.findAll({
        where: { cartId: cartId },
        attributes: [
            [Sequelize.fn('SUM', Sequelize.col('subtotal')), 'total']
        ],
        raw: true
    });

    const total = parseFloat(result[0]?.total || 0);
    
    await carts.update(
        { totalAmount: total },
        { where: { id: cartId } }
    );
};

module.exports = {
    getOrCreateCart,
    addItemToCart,
    updateCartItem,
    removeCartItem,
    clearCart
};

