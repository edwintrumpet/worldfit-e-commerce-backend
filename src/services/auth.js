const MongoLib = require('../lib/mongo')
const { ObjectId } = require('mongodb')

class AuthServices {
    constructor(){
        this.collection = 'users'
        this.mongoDB = new MongoLib()
    }

    async getUser ({ id }) {
        const query = {_id: ObjectId(id)}
        let options = {}
        options.projection = {
            _id: 0,
            password: 0
        }

        const user = await this.mongoDB.getOne(this.collection, query, options)
        return user || {}
    }

    async visitUser ({ id }, { host }) {
        const authorization = await this.getAuthorization(id, host)
        if(authorization){
            const query = {_id: ObjectId(host)}
            let options = {}
            options.projection = {
                _id: 0,
                password: 0
            }
            const user = await this.mongoDB.getOne(this.collection, query, options)
            return user || {}
        }else{
            return {
                message: 'Unauthorized access'
            }
        }
    }

    async login ({ email, password }) {
        const query = {email: email}
        const options = {}

        const user = await this.mongoDB.getOne(this.collection, query, options)
        if(user.password === password){
            return {
                ...user,
                password: null
            }
        }else{
            return {message: 'Unauthorized access'}
        }
    }

    async getAuthorization(id, host) {
        let value = false
        let query = {_id: ObjectId(id)}
        let options = {}
        options.projection = {
            _id: 0,
            permission: 1
        }
        const authorizationsArray = await this.mongoDB.getOne(this.collection, query, options)
        if(id===host){
            value=true
        }else if(authorizationsArray.permission){
            for (let item of authorizationsArray.permission){
                if(item==='all' || item=='visitUser'){
                    value=true
                    break
                }
            }
        }
        return value
    }
}

module.exports = AuthServices