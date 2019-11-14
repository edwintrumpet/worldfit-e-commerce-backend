const joi = require('@hapi/joi')
const { productIdSchema, productPriceSchema } = require('./products')
const { userIdSchema } = require('./users')

const saleIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/)
const saleUserSchema = userIdSchema
const saleProductsSchema = joi.array().items(joi.object({
    product: productIdSchema.required(),
    price: productPriceSchema.required()
}))
const salePaymentMethodSchema = joi.string()
const saleDeliveryAddressSchema = joi.string()
const saleDeliveryStatusSchema = joi.string()
const saleContactPhoneSchema = joi.string()
const saleDateOfSale = joi.date()

const listSalesSchema = {
    user: saleUserSchema,
    idProduct: productIdSchema,
    maxDate: saleDateOfSale,
    minDate: saleDateOfSale,
    paymentMethod: salePaymentMethodSchema,
    deliveryStatus: saleDeliveryStatusSchema
}

const purchaseSchema = {
    products: saleProductsSchema.required(),
    paymentMethod: salePaymentMethodSchema.required(),
    deliveryAddress: saleDeliveryAddressSchema.required(),
    contactPhone: saleContactPhoneSchema.required(),
}

const updateSaleSchema = {
    deliveryStatus: saleDeliveryStatusSchema,
    contactPhone: saleContactPhoneSchema,
    deliveryAddress: saleDeliveryAddressSchema,
    paymentMethod: salePaymentMethodSchema,
    products: saleProductsSchema
}

module.exports = {
    listSalesSchema,
    purchaseSchema,
    saleIdSchema,
    updateSaleSchema
}