const { MongoClient } = require('mongodb')
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

                    console.log(`Connected succesfully to Mongo at ${mongoUri}`)
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

    getOne(collection, id, options) {
        return this.connect().then(db => {
            return db.collection(collection).findOne(id, options)
        })
    }

    create(collection, data) {
        return this.connect().then(db => {
            return db.collection(collection).insertOne(data)
        }).then(result => result.insertedId)
    }

    update(collection, id, data) {
        return this.connect().then(db => {
            return db.collection(collection).updateOne({_id: id}, {$set: data}, {upsert: true})
        }).then(result => result.insertedId || id)
    }

    delete(collection, id) {
        return this.connect().then(db => {
            return db.collection(collection).deleteOne(id)
        }).then(() => id)
    }
}

module.exports = MongoLib
