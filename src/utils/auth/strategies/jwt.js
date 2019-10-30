const passport = require('passport')
const { Strategy, ExtractJwt } = require('passport-jwt')
const Boom = require('@hapi/boom')
const UsersService = require('../../../services/users')
const { config } = require('../../../config')

passport.use(
    new Strategy({
        secretOrKey: config.authJwtSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    },
    async (tokenPayload, cb) => {
        const usersService = new UsersService()
        try {
            const user = await usersService.getWithPassword({ email: tokenPayload.email })
            if(!user){
                return cb(Boom.unauthorized(), false)
            }

            delete user.password

            cb(null, {...user, scopes: tokenPayload.scopes})
        }catch(err){
            return cb(err)
        }
    }
    ))
