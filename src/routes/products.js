const express = require('express')
const ProductsService = require('../services/products')

function products(app) {
    const router = express.Router()
    app.use('/api', router)

    const productsService = new ProductsService()

    router.get('/listproducts', async (req, res) => {
        try {
            const products = await productsService.getProducts(req.body)
            res.status(200).json({data: products, message: 'Products listed'})
        }catch(err) {
            console.log(`error at: ${err}`)
            res.status(500).json({message: err})
        }
    })

    router.get('/showproduct', async (req, res) => {
        try {
            const product = await productsService.getOneProduct(req.body)
            res.status(200).json({data: product, message: 'Product retrieved'})
        }catch(err) {
            console.log(`error at: ${err}`)
            res.status(500).json({message: err})
        }
    })

    router.post('/createproduct', async (req, res) => {
        const { body: product } = req

        try{
            const createdMovieId = await productsService.createProduct({product})
            res.status(200).json({data: createdMovieId, message: "product created"})
        }catch(err){
            console.log(`error at: ${err}`)
            res.status(500).json({message: err})
        }
    })

    router.put('/editproduct', async (req, res) => {

        try{
            const updatedProduct = await productsService.updateProduct(req.body)
            res.status(200).json({data: updatedProduct, message: 'product updated'})
        }catch(err){
            console.log(`error at: ${err}`)
            res.status(500).json({message: err})
        }
    })
}

module.exports = products
