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
        if(user.deleted===true){
            return {}
        }else{
            return user || {}
        }
    }

    async visitUser ({ id }, { host }) {
        const authorization = await this.getAuthorization(id, host, 'visitUser')
        if(authorization){
            const query = {_id: ObjectId(host)}
            let options = {}
            options.projection = {
                _id: 0,
                password: 0
            }
            const user = await this.mongoDB.getOne(this.collection, query, options)
            if(user.deleted===true && id==host){
                return {}
            }else{
                return user || {}
            }
        }else{
            return {
                message: 'Unauthorized access'
            }
        }
    }

    async login ({ email, password }) {
        const query = {email: email}
        const options = {}
        const today = new Date()
        const update = {lastAccess: today}

        const user = await this.mongoDB.getOneAndModify(this.collection, query, update, options)
        if(user.value.password === password){
            return {
                ...user.value,
                password: null
            }
        }else{
            return {message: 'Unauthorized access'}
        }
    }

    async signup (body) {
        const today = new Date()
        const user = {
            ...body,
            createdAt: today,
            rol: 'client'
        }
        const createdUser = await this.mongoDB.create(this.collection, user)
        return createdUser
    }

    async editUser (id, toEdit, body) {
        const {
            name,
            email,
            password,
            rol,
            permission,
            deleted
        } = body
        let data = {}
        const today = new Date()
        if(id===toEdit){
            if(name){
                data.name = name
            }
            if(email){
                data.email = email
            }
            if(password){
                data.password = password
            }
            if(deleted){
                data.deleted = deleted
            }
            data.updatedAt = today
        }else{
            const authorization = this.getAuthorization(id, null, 'editUser')
            if(authorization){
                if(rol){
                    data.rol = rol
                }
                if(permission){
                    data.permission = permission
                }
                if(deleted){
                    data.deleted = deleted
                }
                data.updatedAt = today
            }
        }
        const updatedUser = await this.mongoDB.update(this.collection, ObjectId(toEdit), data)
        return updatedUser
    }

    async deleteUser(id, toDelete) {
        const authorization = this.getAuthorization(id, null, 'deleteUser')
        if(authorization){
            const deletedUser = await this.mongoDB.delete(this.collection, {_id: ObjectId(toDelete)})
            return deletedUser
        }else{
            return {message: 'You do not have authorization to delete'}
        }
    }

    async getAuthorization(id, host, access) {
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
                if(item==='all' || item==access){
                    value=true
                    break
                }
            }
        }
        return value
    }
}

module.exports = AuthServices