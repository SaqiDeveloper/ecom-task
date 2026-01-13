const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const withTransaction = require("../../utils/withTransaction");
const { STATUS_CODES, TEXTS } = require("../../config/constants");
const { products, productVariants } = require('../../models');
const { Op } = require('sequelize');

const createVariant = asyncErrorHandler(async (req, res) => {

    const { businessId, categoryId, productId } = req.params;

    const product = await products.findByPk(productId);

    if (!businessId || !categoryId || !product) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode: STATUS_CODES.NOT_FOUND,
            message: "business , category or Product not found"
        })
    }

    const { name, price, purchasePrice, profitMargin, stock , attributes} = req.body;

    const newVariant = await productVariants.create({
        businessId: businessId,
        categoryId: categoryId,
        productId: productId,
        name: name,
        price: price,
        purchasePrice: purchasePrice || 0.00,
        profitMargin: profitMargin || 0.00,
        stock: stock,
        attributes:attributes
    });

    res.status(STATUS_CODES.SUCCESS).json({
        statusCode: STATUS_CODES.SUCCESS,
        message: "Variant created successfully",
        data: newVariant
    })

});

const getVariant = asyncErrorHandler(async (req, res) => {

    const { businessId, productId } = req.params;

    const product = await products.findByPk(productId);

    if (!businessId || !product) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode: STATUS_CODES.NOT_FOUND,
            message: "business or Product not found"
        })
    }

    const variants = await productVariants.findAll({
        where : {productId: productId}
    });

    res.status(STATUS_CODES.SUCCESS).json({
        statusCode: STATUS_CODES.SUCCESS,
        message: "Variants fetched successfull",
        data: variants
    })
});

const getAllVariants = asyncErrorHandler(async (req, res) => {
    const { businessId } = req.params;

    console.log("getAllVariants called with businessId:", businessId);

    if (!businessId) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode: STATUS_CODES.NOT_FOUND,
            message: "Business not found"
        })
    }

    try {
        let where = {}
        if (req?.query?.search && req.query.search.trim() !== "") {
            where.name = {
                [Op.iLike]: `${req.query.search}%`
            };
        }

        console.log("Querying variants for businessId:", businessId);

        // Query variants directly using businessId
        const variants = await productVariants.findAll({
            where: { 
                businessId: businessId,
                ...where
            },
            ...req.pagination
        });

        console.log("Found variants:", variants.length);

        res.status(STATUS_CODES.SUCCESS).json({
            statusCode: STATUS_CODES.SUCCESS,
            message: "Variants fetched successfully",
            data: variants || []
        })
    } catch (error) {
        console.error("Error in getAllVariants:", error);
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
            message: "Internal server error",
            error: error.message
        })
    }
});

const updateVariant = asyncErrorHandler(async (req, res) => {

    const { businessId, variantId } = req.params;

    if (!businessId) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode: STATUS_CODES.NOT_FOUND,
            message: "business not found"
        })
    }

    const variant = await productVariants.findByPk(variantId);

    if (!variant) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode: STATUS_CODES.NOT_FOUND,
            message: "Variant not found"
        })
    }

    const { sku, name, price, purchasePrice, profitMargin, stock , attributes} = req.body;
    
    if (sku) variant.sku = sku;
    if (name) variant.name = name;
    if (price) variant.price = price;
    if (purchasePrice !== undefined) variant.purchasePrice = purchasePrice;
    if (profitMargin !== undefined) variant.profitMargin = profitMargin;
    if (stock) variant.stock = stock;
    if (attributes) variant.attributes = attributes;

    await variant.save();

    res.status(STATUS_CODES.SUCCESS).json({
        statusCode: STATUS_CODES.SUCCESS,
        message: "Variant updated successfully"
    })
});

const deleteVariant = asyncErrorHandler(async (req, res) => {

    const { businessId, variantId } = req.params;

    if (!businessId) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode: STATUS_CODES.NOT_FOUND,
            message: "business not found"
        })
    }

    const variant = await productVariants.findByPk(variantId);

    if (!variant) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode: STATUS_CODES.NOT_FOUND,
            message: "Variant not found"
        })
    }

    await variant.destroy();

    res.status(STATUS_CODES.SUCCESS).json({
        statusCode: STATUS_CODES.SUCCESS,
        message: "Variant deleted successfully"
    })

});


module.exports = { createVariant, getVariant, getAllVariants, updateVariant, deleteVariant }