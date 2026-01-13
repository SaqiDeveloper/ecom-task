const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const withTransaction = require("../../utils/withTransaction");
const { STATUS_CODES, TEXTS } = require("../../config/constants");
const { products, productVariants } = require('../../models');
const { Op } = require('sequelize');

const createVariant = asyncErrorHandler(async (req, res) => {

    const { productId } = req.params;

    const product = await products.findByPk(productId);

    if (!product) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode: STATUS_CODES.NOT_FOUND,
            message: "Product not found"
        })
    }

    const { variantsName, value, price } = req.body;

    const newVariant = await productVariants.create({
        productId: productId,
        variantsName: variantsName,
        value: value,
        price: price,
        // sku will be auto-generated
    });

    res.status(STATUS_CODES.SUCCESS).json({
        statusCode: STATUS_CODES.SUCCESS,
        message: "Variant created successfully",
        data: newVariant
    })

});

const getVariant = asyncErrorHandler(async (req, res) => {

    const { productId } = req.params;

    const product = await products.findByPk(productId);

    if (!product) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode: STATUS_CODES.NOT_FOUND,
            message: "Product not found"
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
    try {
        let where = {}
        if (req?.query?.search && req.query.search.trim() !== "") {
            where.variantsName = {
                [Op.iLike]: `${req.query.search}%`
            };
        }

        const variants = await productVariants.findAll({
            where: where,
            ...req.pagination
        });

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

    const { variantId } = req.params;

    const variant = await productVariants.findByPk(variantId);

    if (!variant) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode: STATUS_CODES.NOT_FOUND,
            message: "Variant not found"
        })
    }

    const { variantsName, value, price } = req.body;
    
    if (variantsName) variant.variantsName = variantsName;
    if (value) variant.value = value;
    if (price !== undefined) variant.price = price;
    // SKU is auto-generated and cannot be updated

    await variant.save();

    res.status(STATUS_CODES.SUCCESS).json({
        statusCode: STATUS_CODES.SUCCESS,
        message: "Variant updated successfully"
    })
});

const deleteVariant = asyncErrorHandler(async (req, res) => {

    const { variantId } = req.params;

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