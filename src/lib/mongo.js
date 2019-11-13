const { MongoClient } = require('mongodb')
const debug = require('debug')('app:db')
const Boom = require('@hapi/boom')
const { config } = require('../config/')
const USER = encodeURIComponent(config.dbUser)
const PASSWORD = encodeURIComponent(config.dbPassword)
const DB_NAME = config.dbName
const DB_LOCAL = config.dbLocal
let mongoUri

if(DB_LOCAL){
    mongoUri = DB_LOCAL
}else{
    mongoUri = `mongodb+srv://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${DB_NAME}?retryWrites=true&w=majority`
}

class MongoLib {
    constructor(){
        this.client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
        this.dbName = DB_NAME
    }

    connect(){
        if(!MongoLib.connection) {
            MongoLib.connection = new Promise((resolve, reject) => {
                this.client.connect(err => {
                    if(err) {
                        reject(err)
                    }

                    debug(`Connected succesfully to Mongo at ${mongoUri}`)
                    resolve(this.client.db(this.dbName))
                })
            })
        }
        return MongoLib.connection
    }

    get(collection, query, options) {
        return this.connect().then(db => {
            return db.collection(collection).find(query, options).toArray()
        })
    }

    getOne(collection, query, options) {
        return this.connect().then(db => {
            return db.collection(collection).findOne(query, options)
        })
    }

    getOneAndModify(collection, query, update, options) {
        return this.connect().then(db => {
            return db.collection(collection).findOneAndUpdate(query, {$set: update}, options)
        })
    }

    create(collection, data) {
        return this.connect().then(db => {
            return db.collection(collection).insertOne(data)
        })
        .then(result => result.insertedId)
        .catch(err => {
            if(err.code === 11000){
                throw Boom.badRequest('This email already exists')
            }else{
                throw Boom.internal()
            }
        })
    }

    update(collection, id, data) {
        return this.connect().then(db => {
            return db.collection(collection).updateOne({_id: id}, {$set: data}, {upsert: true})
        }).then(result => result.insertedId || id)
    }

    delete(collection, query) {
        return this.connect().then(db => {
            return db.collection(collection).deleteOne(query)
        }).then(() => query)
    }
}

module.exports = MongoLib
