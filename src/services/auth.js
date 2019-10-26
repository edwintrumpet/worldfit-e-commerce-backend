const MongoLib = require('../lib/mongo')
const { ObjectId } = require('mongodb')
const Boom = require('@hapi/boom')

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
        if(user){
            if(user.deleted===true){
                throw Boom.notFound('This user was deleted')
            }else{
                return user
            }
        }else{
            throw Boom.notFound('This user does not exist')
        }
    }

    async visitUser ({ id }, { host }) {
        const authorization = await this.getAuthorization(id, 'visitUser')
        if(authorization || id===host){
            const query = {_id: ObjectId(host)}
            let options = {}
            options.projection = {
                _id: 0,
                password: 0
            }
            const user = await this.mongoDB.getOne(this.collection, query, options)
            return user || {}
        }else{
            throw Boom.forbidden(`You're not authorized to see other users`)
        }
    }

    async getManyUsers ({
        id,
        name,
        email,
        rol,
        nextId
    }) {
        const authorization = await this.getAuthorization(id, 'visitUser')
        if(authorization){
            const nameRegExp = new RegExp(".*" + name + ".*")
            const options = {}
            options.projection = {
                name: 1,
                email: 1,
                rol: 1
            }
            options.limit = 20
            options.sort = {_id: 1, name: 0, email: 0}

            const query = {}

            if(name){
                query.name = {$regex: nameRegExp}
            }
            if(email){
                query.email = email
            }
            if(rol){
                query.rol = rol
            }
            if(id){
                query._id = ObjectId(id)
            }else if(nextId){
                query.id = {$lt: ObjectId(nextId)}
            }
            
            const users = await this.mongoDB.get(this.collection, query, options)
            return users || []
        }else{
            throw Boom.forbidden(`You're not authorized to see other users`)
        }
    }

    async login ({ email, password }) {
        const query = {email: email}
        const options = {}
        const today = new Date()
        const update = {lastAccess: today}
        const user = await this.mongoDB.getOneAndModify(this.collection, query, update, options)
        if(user.value){
            if(user.value.password === password){
                return {
                    ...user.value,
                    password: null
                }
            }else{
                throw Boom.unauthorized('Invalid password')
            }
        }else{
            throw Boom.unauthorized('This user does not exist')
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
            const authorization = this.getAuthorization(id, 'editUser')
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
                if(name){
                    throw Boom.forbidden(`You're not authorized to update name`)
                }
                if(email){
                    throw Boom.forbidden(`You're not authorized to update email`)
                }
                if(password){
                    throw Boom.forbidden(`You're not authorized to update password`)
                }
                if(deleted){
                    data.deleted = deleted
                }
                data.updatedAt = today
            }else{
                throw Boom.forbidden(`You're not authorized to update users info`)
            }
        }
        const updatedUser = await this.mongoDB.update(this.collection, ObjectId(toEdit), data)
        return updatedUser
    }

    async deleteUser(id, toDelete) {
        const authorization = this.getAuthorization(id, 'deleteUser')
        if(authorization){
            const deletedUser = await this.mongoDB.delete(this.collection, {_id: ObjectId(toDelete)})
            return deletedUser
        }else{
            throw Boom.forbidden(`You're not authorized to delete users`)
        }
    }

    async getAuthorization(id, access) {
        let value = false
        let query = {_id: ObjectId(id)}
        let options = {}
        options.projection = {
            _id: 0,
            permission: 1
        }
        const authorizationsArray = await this.mongoDB.getOne(this.collection, query, options)
        if(authorizationsArray.permission){
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