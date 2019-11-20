// DEBUG=app:* node src/scripts/mongo/seedApiKeys.js
// Se usarán posteriormente en server side rendering

const chalk = require('chalk')
const crypto = require('crypto')
const debug = require('debug')('app:scripts:api-keys')
const MongoLib = require('../../lib/mongo')

const rootScopes = [
    'create:products',
    'edit:products',
    'editBuy:products',
    'delete:products',
    'list:users',
    'getown:users',
    'getother:users',
    'create:users',
    'editown:users',
    'editother:users',
    'delete:users',
    'list:sales',
    'listown:sales',
    'listother:sales',
    'create:sales',
    'edit:sales',
    'delete:sales'
]

const adminScopes = [
    'create:products',
    'edit:products',
    'editBuy:products',
    'delete:products',
    'list:users',
    'getown:users',
    'getother:users',
    'editown:users',
    'list:sales',
    'listown:sales',
    'listother:sales',
    'create:sales',
    'edit:sales',
    'delete:sales'
]

const collaboratorScopes = [
    'create:products',
    'edit:products',
    'editBuy:products',
    'delete:products',
    'list:users',
    'getown:users',
    'getother:users',
    'editown:users',
    'list:sales',
    'listown:sales',
    'listother:sales',
    'create:sales'
]

const clientScopes = [
    'editBuy:products',
    'getown:users',
    'editown:users',
    'listown:sales',
    'create:sales'
]

const generateRandomToken = () => {
    const buffer = crypto.randomBytes(32)
    return buffer.toString('hex')
}

const apiKeys = [
    {
        token: generateRandomToken(),
        scopes: rootScopes
    },
    {
        token: generateRandomToken(),
        scopes: adminScopes
    },
    {
        token: generateRandomToken(),
        scopes: collaboratorScopes
    },
    {
        token: generateRandomToken(),
        scopes: clientScopes
    }
]

const seedApiKeys = async () => {
    try{
        const MongoDB = new MongoLib()
        const promises = apiKeys.map(async apiKey => {
            await MongoDB.create('api-keys', apiKey)
        })

        await Promise.all(promises)
        debug(chalk.green(`${promises.length} api-keys have been generated succesfully`))
        return process.exit(0)
    }catch(err){
        debug(chalk.red(err))
        process.exit(1)
    }
}

seedApiKeys()
