const MongoLib = require('../lib/mongo')
const { ObjectId } = require('mongodb')

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
        gender,
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
            price: 1
        }
        options.limit = 2

        switch(orderBy){
            case 'nameProduct':
                options.sort = {nameProduct:0, _id: 1}
                break
            case 'nameProductReverse':
                options.sort = {nameProduct:1, _id: 1}
                break
            case 'price':
                options.sort = {price:0, _id: 1}
                break
            case 'priceReverse':
                options.sort = {price:1, _id: 1}
                break
            default:
                options.sort = {_id: 1}
        }

        if(orderBy){
            switch(orderBy){
                case 'nameProduct':
                    
            }
        }else{
            options.sort = {_id: 1}
        }

        let query = {}

        if(nameProduct){
            query.sexo = {$regex: nameProductRegExp}
        }

        if(description){
            query.nombre = {$regex: descriptionRegExp}
        }

        if(minPrice && maxPrice){
            query.price = {$gte: parseInt(minPrice), $lte: parseInt(maxPrice)}
        }else if(minPrice){
            query.price = {$gte: parseInt(minPrice)}
        }else if(maxPrice){
            query.price = {$lte: parseInt(maxPrice)}
        }

        if(gender){
            query.gender = gender
        }

        if(tags){
            query.tags = {$in: tags}
        }

        if(id){
            query._id = ObjectId(id)
        }else if(nextId){
            query.id = {$lt: ObjectId(nextId)}
        }

        const products = await this.mongoDB.get(this.collection, query, options)
        return products || []
    }

    async getOneProduct({ productId }) {
        const query = {_id: ObjectId(productId)}
        const options = {}

        const product = await this.mongoDB.getOne(this.collection, query, options)
        return product || {}
    }

    async createProduct({ product }) {
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