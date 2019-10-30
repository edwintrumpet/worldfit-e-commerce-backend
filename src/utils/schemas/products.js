const joi = require('@hapi/joi')

const productIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/)
const productNameSchema = joi.string()
const productImagesSchema = joi.array().items(joi.string().uri())
const productDescriptionSchema = joi.string()
const productPriceSchema = joi.number().min(0)
const productTagsSchema = joi.array().items(joi.string())
const productInStockSchema = joi.array().items(joi.object({
    size: joi.string().max(5).required(),
    amount: joi.number().min(0).required()
}))
const productOrderSchema = joi.string().regex(/^((nameProduct)|(nameProductReverse)|(price)|(priceReverse))$/)

const listProductsSchema = {
    nameProduct: productNameSchema,
    description: productDescriptionSchema,
    minPrice: productPriceSchema,
    maxPrice: productPriceSchema,
    tags: productTagsSchema,
    id: productIdSchema,
    nextId: productIdSchema,
    orderBy: productOrderSchema
}

const createProductSchema = {
    nameProduct: productNameSchema.required(),
    images: productImagesSchema,
    description: productDescriptionSchema,
    price: productPriceSchema.required(),
    tags: productTagsSchema,
    inStock: productInStockSchema
}

const updateProductSchema = {
    nameProduct: productNameSchema,
    images: productImagesSchema,
    description: productDescriptionSchema,
    price: productPriceSchema,
    tags: productTagsSchema,
    inStock: productInStockSchema
}

module.exports = {
    productIdSchema,
    listProductsSchema,
    createProductSchema,
    updateProductSchema
}