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
        }
    })
}

module.exports = products
