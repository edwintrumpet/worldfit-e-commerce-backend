// DEBUG=app:* node src/scripts/mongo/seedUsers.js

const chalk = require('chalk')
const debug = require('debug')('app:scripts:api-keys')
const MongoLib = require('../../lib/mongo')
const bcrypt = require('bcrypt')

const users = [
    {
        name: 'root',
        email: 'root@mail.com',
        password: 'rootkey',
        rol: 'root'
    },
    {
        name: 'edwin',
        email: 'edwin@mail.com',
        password: 'edwinkey',
        rol: 'admin'
    },
    {
        name: 'sebastián',
        email: 'sebastian@mail.com',
        password: 'sebastianKey',
        rol: 'admin'
    },
    {
        name: 'lucía',
        email: 'lucia@mail.com',
        password: 'luciaKey',
        rol: 'collaborator'
    },
    {
        name: 'camilo',
        email: 'camilo@mail.com',
        password: 'camiloKey',
        rol: 'client'
    },
    {
        name: 'alejandra',
        email: 'alejandra@mail.com',
        password: 'alejandrakey',
        rol: 'client'
    }
]

const seedUsers = async () => {
    try{
        const MongoDB = new MongoLib()
        const promises = users.map(async user => {
            const hashedPassword = await bcrypt.hash(user.password, 10)
            const today = new Date()
            await MongoDB.create('users', {...user, password: hashedPassword, createdAt: today})
        })

        await Promise.all(promises)
        debug(chalk.green(`${promises.length} users have been generated succesfully`))
        return process.exit(0)
    }catch(err){
        debug(chalk.red(err))
        process.exit(1)
    }
}

seedUsers()
