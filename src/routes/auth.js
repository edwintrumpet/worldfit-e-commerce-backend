const express = require('express')
const isAuth = require('../utils/middlewares/isAuth')
const AuthServices = require('../services/auth')

function authRoutes(app) {
    const router = express.Router()
    app.use('/api/users', router)

    const authServices = new AuthServices()

    router.get('/', isAuth, async (req, res) => {
        try{
            const user = await authServices.getUser(req.token)
            res.status(200).json(user)
        }catch(err){
            console.log(`error at: ${err}`)
            res.status(500).json({message: 'err'})
        }
    })

    router.get('/:host', isAuth, async (req, res) => {
        try{
            const user = await authServices.visitUser(req.token, req.params)
            res.status(200).json(user)
        }catch(err){
            console.log(`error at: ${err}`)
            res.status(500).json({message: 'err'})
        }
    })

    router.post('/login', async (req, res) => {
        try{
            const user = await authServices.login(req.body)
            res.status(200).json(user)
        }catch(err){
            console.log(`error at: ${err}`)
            res.status(500).json({message: 'err'})
        }
    })
}

module.exports = authRoutes