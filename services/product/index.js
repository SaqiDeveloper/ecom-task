const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const withTransaction = require("../../utils/withTransaction");
const { STATUS_CODES, TEXTS } = require("../../config/constants");
const { products } = require('../../models');
const {paginatedResponse} = require('../../middlewares/paginate');
const { Op } = require('sequelize');



const createProduct = asyncErrorHandler(async (req, res) => {

    const { businessId } = req.params;

    const { name, desc, isVariable, isActive, price, purchasePrice, profitMargin, stock } = req.body;

    const newProduct = await products.create({
        businessId: businessId,
        name: name,
        desc: desc,
        isVariable: isVariable || false,
        isActive: isActive !== undefined ? isActive : true,
        price: price || 0.00,
        purchasePrice: purchasePrice || 0.00,
        profitMargin: profitMargin || 0.00,
        stock: stock || null
    });

    res.status(STATUS_CODES.SUCCESS).json({
        statusCode: STATUS_CODES.SUCCESS,
        message: "Product created successfully",
        data: newProduct
    })


});


const getProduct = asyncErrorHandler(async (req, res) => {

    const { businessId, productId } = req.params;

    const product = await products.findByPk(productId);

    if (!product) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode: STATUS_CODES.NOT_FOUND,
            message: "Product not found"
        })
    }

    res.status(STATUS_CODES.SUCCESS).json({
        statusCode: STATUS_CODES.SUCCESS,
        message: "Product fetched successfully",
        data: product
    })

});

const getAllProducts = asyncErrorHandler(async (req, res) => {
    const { businessId } = req.params;

    let where = {}
    if (req?.query?.search && req.query.search.trim() !== "") {
        where.name = {
            [Op.iLike]: `${req.query.search}%`
        };
    }

    const { rows, count } = await products.findAndCountAll({
        where: { businessId: businessId },
        ...req.pagination
    });

    const result = paginatedResponse(rows, count, req.query?.page, req.query?.limit);

    res.status(STATUS_CODES.SUCCESS).json({
        statusCode: STATUS_CODES.SUCCESS,
        message: "Products fetched successfully",
        data: result
    })
});

const updateProduct = asyncErrorHandler(async (req, res) => {

    const { businessId , productId } = req.params;

    const product = await products.findByPk(productId);

    if (!product) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode: STATUS_CODES.NOT_FOUND,
            message: "Product not found"
        })
    }

    const { name, desc, isVariable, isActive, price, purchasePrice, profitMargin, stock } = req.body;

    if (name) product.name = name;
    if (desc) product.desc = desc;
    if (isVariable !== undefined) product.isVariable = isVariable;
    if (isActive !== undefined) product.isActive = isActive;
    if (price !== undefined) product.price = price;
    if (purchasePrice !== undefined) product.purchasePrice = purchasePrice;
    if (profitMargin !== undefined) product.profitMargin = profitMargin;
    if (stock !== undefined) product.stock = stock;

    await product.save();

    res.status(STATUS_CODES.SUCCESS).json({
        statusCode: STATUS_CODES.SUCCESS,
        message: "Product updated successfully"
    })
});


const deleteProduct = asyncErrorHandler(async (req, res) => {
 const { businessId , productId } = req.params;

    const product = await products.findByPk(productId);

    if (!product) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode: STATUS_CODES.NOT_FOUND,
            message: "Product not found"
        })
    }

    await product.destroy();

    res.status(STATUS_CODES.SUCCESS).json({
        statusCode: STATUS_CODES.SUCCESS,
        message: "Product deleted successfully"
    })
});

module.exports = { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct };