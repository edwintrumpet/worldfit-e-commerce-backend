const express = require('express')
const passport = require('passport')
const ProductsService = require('../services/products')
const {
    productIdSchema,
    createProductSchema,
    updateProductSchema
} = require('../utils/schemas/products')
const validationHandler = require('../utils/middlewares/validationHandler')
const scopesValidationHandler = require('../utils/middlewares/scopesValidationHandler')
// JWT strategy
require('../utils/auth/strategies/jwt')

function productsRoutes(app) {
    const router = express.Router()
    app.use('/api/products', router)
    const productsService = new ProductsService()

    router.get('/', async (req, res, next) => {
        try {
            const products = await productsService.getProducts(req.body)
            res.status(200).json({data: products, message: 'Products listed'})
        }catch(err) {
            next(err)
        }
    })

    router.get(
        '/:productId',
        validationHandler({ productId: productIdSchema }, 'params'),
        async (req, res, next) => {
        try {
            const product = await productsService.getOneProduct(req.params)
            res.status(200).json({data: product, message: 'Product retrieved'})
        }catch(err) {
            next(err)
        }
    })

    router.post(
        '/',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['create:products']),
        validationHandler(createProductSchema),
        async (req, res, next) => {
        try{
            const createdMovieId = await productsService.createProduct(req.body)
            res.status(201).json({data: createdMovieId, message: "Product created"})
        }catch(err){
            next(err)
        }
    })

    router.put(
        '/:productId',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['edit:products']),
        validationHandler({ productId: productIdSchema }, 'params'),
        validationHandler(updateProductSchema),
        async (req, res, next) => {
        const { productId } = req.params
        const { body: product } = req
        try{
            const updatedProduct = await productsService.updateProduct(productId, product)
            res.status(200).json({data: updatedProduct, message: 'Product updated'})
        }catch(err){
            next(err)
        }
    })

    router.delete(
        '/:productId',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['delete:products']),
        validationHandler({ productId: productIdSchema }, 'params'),
        async (req, res, next) => {
        try{
            const deletedProduct = await productsService.deleteProduct(req.params)
            res.status(200).json({data: deletedProduct, message: 'Product deleted'})
        }catch(err){
            next(err)
        }
    })
}

module.exports = productsRoutes
