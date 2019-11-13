const express = require('express')
const passport = require('passport')
const UsersServices = require('../services/users')
const validationHandler = require('../utils/middlewares/validationHandler')
const {
    createUserSchema,
    listUsersSchema,
    userIdSchema,
    updateMyUserSchema
} = require('../utils/schemas/users')
const scopesValidationHandler = require('../utils/middlewares/scopesValidationHandler')
// JWT Strategy
require('../utils/auth/strategies/jwt')

function usersRoutes(app) {
    const router = express.Router()
    app.use('/api/users', router)
    const usersServices = new UsersServices()

    router.get(
        '/',
        validationHandler(listUsersSchema),
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['list:users']),
        async (req, res, next) => {
        try{
            const users = await usersServices.getMany(req.body)
            res.status(200).json({data: users, message: 'User list'})
        }catch(err){
            next(err)
        }
    })

    router.get(
        '/own',
        passport.authenticate('jwt', { session: false }),
        async (req, res, next) => {
        try{
            const user = await usersServices.getOwn(req.user.id)
            res.status(200).json({data: user, message: 'Authenticated user data'})
        }catch(err){
            next(err)
        }
    })

    router.get(
        '/:userId',
        validationHandler({userId: userIdSchema}, 'params'),
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['getother:users']),
        async (req, res, next) => {
        try{
            const user = await usersServices.getOne(req.params)
            res.status(200).json({data: user, message: 'User data'})
        }catch(err){
            next(err)
        }
    })

    router.post(
        '/',
        validationHandler(createUserSchema),
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['create:users']),
        async (req, res, next) => {
        try{
            const createdUserId = await usersServices.createUser(req.body)
            res.status(201).json({ data: { id: createdUserId }, message: 'User created' })
        }catch(err){
            next(err)
        }
    })

    router.put(
        '/',
        validationHandler(updateMyUserSchema),
        passport.authenticate('jwt', { session: false }),
        async (req, res, next) => {
        const { body } = req
        const { id } = req.user
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