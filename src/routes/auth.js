const express = require('express')
const passport = require('passport')
const Boom = require('@hapi/boom')
const jwt = require('jsonwebtoken')
const ApiKeysService = require('../services/apiKeys')
const UsersServices = require('../services/users')
const validationHandler = require('../utils/middlewares/validationHandler')
const { config } = require('../config')
const { createUserSchema } = require('../utils/schemas/users')

require('../utils/auth/strategies/basic')

function authApi(app){
    const router = express.Router()
    app.use('/api/auth', router)

    const apiKeysService = new ApiKeysService()
    const usersServices = new UsersServices()

    router.post('/sign-in', async (req, res, next) => {
        const { apiKeyToken } = req.body
        if(!apiKeyToken){
            next(Boom.unauthorized('apiKeyToken is required'))
        }
        passport.authenticate('basic', (err, user) => {
            try {
                if(err || !user){
                    next(Boom.unauthorized())
                }
                req.login(user, { session: false }, async (err) => {
                    if(err){
                        next(err)
                    }
                    const apiKey = await apiKeysService.getApiKey({ token: apiKeyToken })
                    if(!apiKey){
                        next(Boom.unauthorized())
                    }
                    const {_id: id, name, email} = user
                    const payload = {
                        sub: id,
                        name,
                        email,
                        scopes: apiKey.scopes
                    }
                    const token = jwt.sign(payload, config.authJwtSecret, {expiresIn: '15m'})
                    return res.status(200).json({token, user: {id, name, email}})
                })
            }catch(err){
                next(err)
            }
        })(req, res, next)
    })

    router.post('/sign-up', validationHandler(createUserSchema), async (req, res, next) => {
        try{
            const createdUserId = await usersServices.createUser(req.body)
            res.status(201).json({data: createdUserId, message: 'User created'})
        }catch(err){
            next(err)
        }
    })
}

module.exports = authApi
