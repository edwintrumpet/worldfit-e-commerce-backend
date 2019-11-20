const MongoLib = require('../lib/mongo')
const { ObjectId } = require('mongodb')
// const Boom = require('@hapi/boom')

class ProductsService {
    constructor() {
        this.collection = 'products'
        this.mongoDB = new MongoLib()
    }

    async getProducts({
        nameProduct,
        description,
        minPrice,
        maxPrice,
        tags,
        id,
        nextId,
        orderBy
    }) {
        const nameProductRegExp = new RegExp(".*" + nameProduct + ".*")
        const descriptionRegExp = new RegExp(".*" + description + ".*")
        const options = {}
        options.projection = {
            nameProduct: 1,
            images: 1,
            minPrice: 1,
            maxPrice: 1,
            tags: 1
        }
        // options.limit = 10

        switch(orderBy){
            case 'nameProduct':
                options.sort = {nameProduct:1, _id: -1}
                break
            case 'nameProductReverse':
                options.sort = {nameProduct:-1, _id: -1}
                break
            case 'price':
                options.sort = {maxPrice:1, _id: -1}
                break
            case 'priceReverse':
                options.sort = {maxPrice:-1, _id: -1}
                break
            default:
                options.sort = {_id: -1}
        }

        let query = {}

        if(nameProduct){
            query.nameProduct = {$regex: nameProductRegExp}
        }
        if(description){
            query.description = {$regex: descriptionRegExp}
        }
        if(minPrice && maxPrice){
            query.maxPrice = {$gte: parseInt(minPrice), $lte: parseInt(maxPrice)}
        }else if(minPrice){
            query.maxPrice = {$gte: parseInt(minPrice)}
        }else if(maxPrice){
            query.maxPrice = {$lte: parseInt(maxPrice)}
        }
        if(tags){
            query.tags = {$in: tags}
        }
        if(id){
            query._id = ObjectId(id)
        }else if(nextId){
            query._id = {$lt: ObjectId(nextId)}
        }

        let products = await this.mongoDB.get(this.collection, query, options)
        products = products.map(product => {
            let changedId = {
                ...product,
                id: product._id
            }
            delete changedId._id
            return changedId
        })
        return products || []
    }

    async getOneProduct({ productId }) {
        const product = await this.mongoDB.getOne(this.collection, {_id: ObjectId(productId)}, {})
        return product || {}
    }

    async createProduct( product ) {
        const createdProductId = await this.mongoDB.create(this.collection, product)
        return createdProductId
    }

    async updateProduct(productId, product){
        const updatedProductId = await this.mongoDB.update(this.collection, ObjectId(productId), product)
        return updatedProductId
    }

    async deleteProduct({ productId }){
        const deletedProductId = await this.mongoDB.delete(this.collection, {_id: ObjectId(productId)})
        return deletedProductId
    }
}

module.exports = ProductsService
