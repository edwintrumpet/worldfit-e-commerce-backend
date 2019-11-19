const express = require('express')
const passport = require('passport')
const Boom = require('@hapi/boom')
const jwt = require('jsonwebtoken')
const UsersServices = require('../services/users')
const validationHandler = require('../utils/middlewares/validationHandler')
const { config } = require('../config')
const { createClientSchema } = require('../utils/schemas/users')
const scopes = require('../utils/auth/scopes')
// Basic Strategy
require('../utils/auth/strategies/basic')

function authApi(app){
    const router = express.Router()
    app.use('/api/auth', router)
    const usersServices = new UsersServices()

    router.post('/test', (req, res) => {
        res.status(200).json({message: "all ok"})
    })

    router.post('/sign-in', async (req, res, next) => {
        passport.authenticate('basic', (err, user) => {
            try {
                if(err || !user){
                    next(Boom.unauthorized())
                }
                req.login(user, { session: false }, async (err) => {
                    if(err){
                        next(err)
                    }
                    const { _id: id, name, email, rol } = user
                    const payload = {
                        sub: id,
                        scopes: scopes[rol]
                    }
                    const token = jwt.sign(payload, config.authJwtSecret, {expiresIn: '15m'})
                    return res.cookie('token', token, {
                        httpOnly: !config.dev,
                        secure: !config.dev
                    }).status(200).json({user: {id, name, email, rol}})
                })
            }catch(err){
                next(err)
            }
        })(req, res, next)
    })

    router.post(
        '/sign-up',
        validationHandler(createClientSchema),
        async (req, res, next) => {
        try{
            const createdUserId = await usersServices.createUser(req.body)
            const payload = {
                sub: createdUserId,
                scopes: scopes.client
            }
            const token = jwt.sign(payload, config.authJwtSecret, {expiresIn: '15m'})
            res.cookie('token', token, {
                httpOnly: !config.dev,
                secure: !config.dev
            }).status(201).json(
                { data: { id: createdUserId, rol: 'client' }, message: 'User created' }
            )
        }catch(err){
            next(err)
        }
    })

    router.post(
        '/log-out',
        (req, res) => {
            res.clearCookie('token').status(200).json({ message: 'Session ended' })
        }
    )
}

module.exports = authApi
