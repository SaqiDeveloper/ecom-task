const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const { STATUS_CODES } = require("../../config/constants");
const { carts, cartItems, orders, orderItems, payments, products, productVariants } = require('../../models');
const { paymentQueue, addJob, QUEUE_CONFIG } = require('../../config/queue');
const { Op } = require('sequelize');
const Sequelize = require('sequelize');
const { sequelize } = require('../../models');

// Checkout - Create order from cart
const checkout = asyncErrorHandler(async (req, res) => {
    const userId = req.user.id;
    const { shippingAddress, paymentMethod } = req.body;

    // Get active cart
    const cart = await carts.findOne({
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
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode: STATUS_CODES.NOT_FOUND,
            message: "Cart not found"
        });
    }

    if (!cart.CartItems || cart.CartItems.length === 0) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            statusCode: STATUS_CODES.BAD_REQUEST,
            message: "Cart is empty"
        });
    }

    // Create order using transaction
    const order = await sequelize.transaction(async (t) => {
        // Create order
        const newOrder = await orders.create({
            userId: userId,
            cartId: cart.id,
            totalAmount: cart.totalAmount,
            shippingAddress: shippingAddress || null,
            status: 'pending',
            paymentStatus: 'pending',
        }, { transaction: t });

        // Create order items from cart items
        const orderItemsData = cart.CartItems.map(item => ({
            orderId: newOrder.id,
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.subtotal,
        }));

        await orderItems.bulkCreate(orderItemsData, { transaction: t });

        // Create payment record
        const payment = await payments.create({
            orderId: newOrder.id,
            userId: userId,
            amount: cart.totalAmount,
            paymentMethod: paymentMethod,
            status: 'pending',
        }, { transaction: t });

        // Update cart status to completed
        cart.status = 'completed';
        await cart.save({ transaction: t });

        return { order: newOrder, payment };
    });

    // Queue background jobs (non-blocking) - High priority for immediate processing
    try {
        // Queue payment processing job with high priority
        await addJob(
            paymentQueue,
            'process-payment',
            {
                paymentId: order.payment.id,
                orderId: order.order.id,
                paymentData: {
                    method: paymentMethod,
                    amount: cart.totalAmount,
                }
            },
            {
                priority: QUEUE_CONFIG.JOB_OPTIONS.PRIORITY.HIGH, // High priority for payment
            }
        );

        console.log(`Payment job queued for order ${order.order.id}`);
    } catch (error) {
        console.error('Error queueing payment job:', error);
        // Don't fail the checkout if job queueing fails
        // In production, you might want to log to monitoring system
    }

    // Return order immediately (payment processing happens in background)
    res.status(STATUS_CODES.CREATED).json({
        statusCode: STATUS_CODES.CREATED,
        message: "Order created successfully. Payment processing in progress.",
        data: {
            order: order.order,
            payment: {
                id: order.payment.id,
                status: order.payment.status,
                paymentMethod: order.payment.paymentMethod,
            }
        }
    });
});

// Get order by ID
const getOrder = asyncErrorHandler(async (req, res) => {
    const userId = req.user.id;
    const { orderId } = req.params;

    const order = await orders.findOne({
        where: {
            id: orderId,
            userId: userId
        },
        include: [
            {
                model: orderItems,
                as: 'OrderItems',
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
            },
            {
                model: payments,
                as: 'Payments'
            }
        ]
    });

    if (!order) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode: STATUS_CODES.NOT_FOUND,
            message: "Order not found"
        });
    }

    res.status(STATUS_CODES.SUCCESS).json({
        statusCode: STATUS_CODES.SUCCESS,
        message: "Order fetched successfully",
        data: order
    });
});

// Get all orders for user
const getUserOrders = asyncErrorHandler(async (req, res) => {
    const userId = req.user.id;
    const { paginatedResponse } = require('../../middlewares/paginate');

    const { rows, count } = await orders.findAndCountAll({
        where: {
            userId: userId
        },
        include: [
            {
                model: orderItems,
                as: 'OrderItems',
                include: [
                    {
                        model: products,
                        as: 'Product'
                    }
                ]
            }
        ],
        order: [['createdAt', 'DESC']],
        ...req.pagination
    });

    const result = paginatedResponse(rows, count, req.query?.page, req.query?.limit);

    res.status(STATUS_CODES.SUCCESS).json({
        statusCode: STATUS_CODES.SUCCESS,
        message: "Orders fetched successfully",
        data: result
    });
});

module.exports = {
    checkout,
    getOrder,
    getUserOrders
};

