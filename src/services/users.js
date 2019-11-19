const MongoLib = require('../lib/mongo')
const { ObjectId } = require('mongodb')
const Boom = require('@hapi/boom')
const bcrypt = require('bcrypt')

class UsersServices {
    constructor(){
        this.collection = 'users'
        this.mongoDB = new MongoLib()
    }

    async getOwn ( id ) {
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
                return {
                    ...user,
                    id
                }
            }
        }else{
            throw Boom.notFound('This user does not exist')
        }
    }

    async getOne ({ userId }) {
        const query = {_id: ObjectId(userId)}
        let options = {}
        options.projection = {
            _id: 0,
            password: 0
        }
        const user = await this.mongoDB.getOne(this.collection, query, options)
        return user || {}
    }

    async getMany ({
        id,
        name,
        email,
        rol,
        nextId
    }) {
        const nameRegExp = new RegExp(".*" + name + ".*")
        const options = {}
        options.projection = {
            name: 1,
            email: 1,
            rol: 1
        }
        // options.limit = 2
        options.sort = {_id: -1, name: 1, email: 1}

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
            query._id = {$lt: ObjectId(nextId)}
        }
        
        const users = await this.mongoDB.get(this.collection, query, options)
        return users || []
    }

    async getWithPassword({ email }) {
        const query = {email: email}
        const user = await this.mongoDB.getOne(this.collection, query, {})
        return user
    }

    async createUser (body) {
        const today = new Date()
        const hashedPassword = await bcrypt.hash(body.password, 10)
        const user = {
            ...body,
            password: hashedPassword,
            createdAt: today,
            rol: body.rol || 'client'
        }
        const createdUser = await this.mongoDB.create(this.collection, user)
        return createdUser
    }

    async editOwn (id, body) {
        const {
            name,
            email,
            password,
            deleted
        } = body
        let data = {}
        const today = new Date()
        if(name){
            data.name = name
        }
        if(email){
            data.email = email
        }
        if(password){
            const hashedPassword = await bcrypt.hash(password, 10)
            data.password = hashedPassword
        }
        if(deleted){
            data.deleted = deleted
        }
        data.updatedAt = today
        const updatedUser = await this.mongoDB.update(this.collection, ObjectId(id), data)
        return updatedUser
    }

    async editUser (id, body) {
        const {
            name,
            email,
            password,
            deleted,
            rol
        } = body
        let data = {}
        const today = new Date()
        if(name){
            data.name = name
        }
        if(email){
            data.email = email
        }
        if(password){
            const hashedPassword = await bcrypt.hash(password, 10)
            data.password = hashedPassword
        }
        if(deleted){
            data.deleted = deleted
        }
        if(rol){
            data.rol = rol
        }
        data.updatedAt = today
        const updatedUser = await this.mongoDB.update(this.collection, ObjectId(id), data)
        return updatedUser
    }

    async deleteUser(id) {
        const deletedUser = await this.mongoDB.delete(this.collection, {_id: ObjectId(id)})
        return deletedUser
    }
}

module.exports = UsersServices