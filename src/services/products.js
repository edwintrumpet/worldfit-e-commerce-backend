const MongoLib = require('../lib/mongo')
const { ObjectId } = require('mongodb')

class ProductsService {
    constructor() {
        this.collection = 'products'
        this.mongoDB = new MongoLib()
    }

    async getProducts({ nameProduct, description, minPrice, maxPrice, gender, tags, id }) {
        const nameProductRegExp = new RegExp(".*" + nameProduct + ".*")
        const descriptionRegExp = new RegExp(".*" + description + ".*")

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
        }

        const products = await this.mongoDB.get(this.collection, query)
        return products || []
    }
}

module.exports = ProductsService