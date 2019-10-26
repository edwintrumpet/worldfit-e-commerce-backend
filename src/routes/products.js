const express = require('express')
const ProductsService = require('../services/products')

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

    router.get('/:productId', async (req, res, next) => {
        try {
            const product = await productsService.getOneProduct(req.params)
            res.status(200).json({data: product, message: 'Product retrieved'})
        }catch(err) {
            next(err)
        }
    })

    router.post('/', async (req, res, next) => {
        const { body: product } = req
        try{
            const createdMovieId = await productsService.createProduct({product})
            res.status(201).json({data: createdMovieId, message: "product created"})
        }catch(err){
            next(err)
        }
    })

    router.put('/:productId', async (req, res, next) => {
        const { productId } = req.params
        const { body: product } = req
        try{
            const updatedProduct = await productsService.updateProduct(productId, product)
            res.status(200).json({data: updatedProduct, message: 'product updated'})
        }catch(err){
            next(err)
        }
    })

    router.delete('/:productId', async (req, res, next) => {
        try{
            const deletedProduct = await productsService.deleteProduct(req.params)
            res.status(200).json({data: deletedProduct, message: 'product deleted'})
        }catch(err){
            next(err)
        }
    })
}

module.exports = productsRoutes
