const passport = require('passport')
const { BasicStrategy } = require('passport-http')
const Boom = require('@hapi/boom')
const bcrypt = require('bcrypt')
const UsersService = require('../../../services/users')

passport.use(new BasicStrategy(async (email, password, cb) => {
    const userService = new UsersService()

    try {
        const user = await userService.getWithPassword({ email })

        if(!user){
            return cb(Boom.unauthorized(), false)
        }
        if(!(await bcrypt.compare(password, user.password))){
            return cb(Boom.unauthorized(), false)
        }
        delete user.password
        return cb(null, user)
    }catch(err){
        cb(err)
    }
}))