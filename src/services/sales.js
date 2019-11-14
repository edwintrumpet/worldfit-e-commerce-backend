const MongoLib = require('../lib/mongo')
const { ObjectId } = require('mongodb')

class SalesService {
    constructor() {
        this.collection = 'sales'
        this.mongoDB = new MongoLib()
    }

    async getSales({
        user,
        product,
        maxDate,
        minDate,
        paymentMethod,
        deliveryStatus
    }, idUser) {
        const options = {}
        options.projection = {
            user: 1,
            products: 1,
            createdAt: 1,
            paymentMethod: 1,
            deliveyStatus: 1
        }
        // options.limit = 10
        options.sort = {_id: -1}
        let query = {}
        if(idUser){
            query.user = idUser
        }
        if(user){
            query.user = user
        }
        if(product){
            query.products = {$in: product}
        }
        if(minDate && maxDate){
            query.createdAt = {$gte: minDate, $lte: maxDate}
        }else if(minDate){
            query.createdAt = {$gte: minDate}
        }else if(maxDate){
            query.createdAt = {$lte: maxDate}
        }
        if(paymentMethod){
            query.paymentMethod = paymentMethod
        }
        if(deliveryStatus){
            query.deliveryStatus = deliveryStatus
        }
        const sales = await this.mongoDB.get(this.collection, query, options)
        return sales || []
    }

    async getSaleDetails({ saleId }) {
        const sale = await this.mongoDB.getOne(this.collection, {_id: ObjectId(saleId)}, {})
        return sale || {}
    }

    async getMyOwnSales(id, body) {
        const sales = await this.getSales(body, id)
        return sales
    }

    async getMyOwnSaleDetails(userId, saleId) {
        const sale = await this.mongoDB.getOne(this.collection, {_id: ObjectId(saleId), user: userId}, {})
        return sale || {}
    }

    async createSale(data, userId) {
        const today = new Date()
        const buy = {
            ...data,
            user: userId,
            createdAt: today,
            deliveryStatus: 'Pago recibido, esperando autorización'
        }
        const saleId = await this.mongoDB.create(this.collection, buy)
        return saleId
    }

    async updateSale(id, body) {
        const today = new Date()
        const data = {
            ...body,
            updatedAt: today
        }
        const updatedSaleId = await this.mongoDB.update(this.collection, ObjectId(id), data)
        return updatedSaleId
    }

    async deleteSale(saleId) {
        const deletedProductId = await this.mongoDB.delete(this.collection, {_id: ObjectId(saleId)})
        return deletedProductId
    }
}

module.exports = SalesService
