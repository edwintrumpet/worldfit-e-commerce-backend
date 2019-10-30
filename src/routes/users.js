const express = require('express')
const UsersServices = require('../services/users')

function usersRoutes(app) {
    const router = express.Router()
    app.use('/api/users', router)
    const usersServices = new UsersServices()

    router.get('/', async (req, res, next) => {
        try{
            const users = await usersServices.getMany(req.body)
            res.status(200).json({data: users, message: 'User list'})
        }catch(err){
            next(err)
        }
    })

    router.get('/own', async (req, res, next) => {
        try{
            // Debo pasarle el id desde el token
            const user = await usersServices.getOwn(req.body.id)
            res.status(200).json({data: user, message: 'Authenticated user data'})
        }catch(err){
            next(err)
        }
    })

    router.get('/:userId', async (req, res, next) => {
        try{
            const user = await usersServices.getOne(req.params)
            res.status(200).json({data: user, message: 'User data'})
        }catch(err){
            next(err)
        }
    })

    router.post('/', async (req, res, next) => {
        try{
            const createdUser = await usersServices.createUser(req.body)
            res.status(201).json({data: createdUser, message: 'User created'})
        }catch(err){
            next(err)
        }
    })

    router.put('/', async (req, res, next) => {
        // Recibir el id desde el token
        const { id, data: body } = req.body
        try{
            const updatedUser = await usersServices.editOwn(id, body)
            res.status(200).json({data: updatedUser, message: 'User updated'})
        }catch(err){
            next(err)
        }
    })

    router.put('/:userId', async (req, res, next) => {
        const { body } = req
        const { userId: id } = req.params
        try{
            const updatedUser = await usersServices.editUser(id, body)
            res.status(200).json({data: updatedUser, message: 'User updated'})
        }catch(err){
            next(err)
        }
    })

    router.delete('/:userId', async (req, res, next) => {
        const { userId } = req.params
        try{
            const deletedUser = await usersServices.deleteUser(userId)
            res.status(200).json({data: deletedUser, message: 'User deleted'})
        }catch(err){
            next(err)
        }
    })
}

module.exports = usersRoutes