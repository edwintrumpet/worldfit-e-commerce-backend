const passport = require('passport')
const { Strategy, ExtractJwt } = require('passport-jwt')
// const debug = require('debug')('app:jwt')
const { config } = require('../../../config')

const cookieExtractor = req => {
    let token = null
    if(req && req.cookies){
        token = req.cookies['token']
    }
    return token
}

passport.use(
    new Strategy({
        secretOrKey: config.authJwtSecret,
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor])
    },
    async (tokenPayload, cb) => {
        try {
            cb(null, { id: tokenPayload.sub, scopes: tokenPayload.scopes})
        }catch(err){
            return cb(err)
        }
    }
    )
)
