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
            res.status(200).json({data: user, message: 'Credentials'})
        }catch(err){
            console.log(`error at: ${err}`)
            res.status(500).json({message: 'err'})
        }
    })

    router.get('/:host', isAuth, async (req, res) => {
        try{
            const user = await authServices.visitUser(req.token, req.params)
            res.status(200).json({data: user, message: 'user info'})
        }catch(err){
            console.log(`error at: ${err}`)
            res.status(500).json({message: 'err'})
        }
    })

    router.post('/login', async (req, res) => {
        try{
            const user = await authServices.login(req.body)
            res.status(200).json({data: user, message: 'logged'})
        }catch(err){
            console.log(`error at: ${err}`)
            res.status(500).json({message: 'err'})
        }
    })

    router.post('/signup', async (req, res) => {
        const { body } = req
        try{
            const createdUserId = await authServices.signup(body)
            res.status(200).json({data: createdUserId, message: 'user created'})
        }catch(err){
            console.log(`error at: ${err}`)
            res.status(500).json({message: 'err'})
        }
    })

    router.put('/:userId', isAuth, async (req, res) => {
        const { id } = req.token
        const { userId: toEdit } = req.params
        const { body } = req
        try{
            const updatedUser = await authServices.editUser(id, toEdit, body)
            res.status(200).json({data: updatedUser, message: 'user updated'})
        }catch(err){
            console.log(`error at: ${err}`)
            res.status(500).json({message: 'err'})
        }
    })

    router.delete('/:userId', isAuth, async (req, res) => {
        const { id } = req.token
        const { userId: toDelete } = req.params
        try{
            const deletedUser = await authServices.deleteUser(id, toDelete)
            res.status(200).json({data: deletedUser, message: 'user deleted'})
        }catch(err){
            console.log(`error at: ${err}`)
            res.status(500).json({message: 'err'})
        }
    })
}

module.exports = authRoutes