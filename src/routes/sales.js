const express = require('express')
const passport = require('passport')
const SalesService = require('../services/sales')
const validationHandler = require('../utils/middlewares/validationHandler')
const {
    listSalesSchema,
    saleIdSchema,
    purchaseSchema,
    updateSaleSchema
} = require('../utils/schemas/sales')
const scopesValidationHandler = require('../utils/middlewares/scopesValidationHandler')
// JWT strategy
require('../utils/auth/strategies/jwt')

const salesRoutes = app => {
    const router = express.Router()
    app.use('/api/sales', router)
    const salesService = new SalesService()

    router.get(
        '/',
        validationHandler(listSalesSchema),
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['list:sales']),
        async (req, res, next) => {
        try{
            const sales = await salesService.getSales(req.body)
            res.status(200).json({data: sales, message: 'Sales listed'})
        }catch(err){
            next(err)
        }
    })

    router.get(
        '/myshopping',
        validationHandler(listSalesSchema),
        passport.authenticate('jwt', { session: false }),
        async (req, res, next) => {
            const { body } = req
            const { id } = req.user
            try{
                const sales = await salesService.getMyOwnSales(id, body)
                res.status(200).json({data: sales, message: 'My purchases listed'})
            }catch(err){
                next(err)
            }
        }
    )

    router.get(
        '/:saleId',
        validationHandler({ saleId: saleIdSchema }, 'params'),
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['detail:sales']),
        async (req, res, next) => {
            try{
                const sale = await salesService.getSaleDetails(req.params)
                res.status(200).json({data: sale, message: 'Sale retrieved'})
            }catch(err){
                next(err)
            }
        }
    )

    router.get(
        '/myshopping/:id',
        validationHandler({ id: saleIdSchema }, 'params'),
        passport.authenticate('jwt', { session: false }),
        async (req, res, next) => {
            const saleId = req.params.id
            const userId = req.user.id
            try{
                const sale = await salesService.getMyOwnSaleDetails(userId, saleId)
                res.status(200).json({data: sale, message: 'Sale retrieved'})
            }catch(err){
                next(err)
            }
        }
    )

    router.post(
        '/',
        validationHandler(purchaseSchema),
        passport.authenticate('jwt', { session: false }),
        async (req, res, next) => {
            const data = req.body
            const userId = req.user.id
            try{
                const saleId = await salesService.createSale(data, userId)
                res.status(201).json({data: {id: saleId}, message: 'Sold'})
            }catch(err){
                next(err)
            }
        }
    )

    router.put(
        '/:id',
        validationHandler(updateSaleSchema),
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['edit:sales']),
        async (req, res, next) => {
            const { body } = req
            const { id } = req.params
            try{
                const updatedSaleId = await salesService.updateSale(id, body)
                res.status(200).json({data: updatedSaleId, message: 'Modified Sale'})
            }catch(err){
                next(err)
            }
        }
    )

    router.delete(
        '/:saleId',
        validationHandler({ saleId: saleIdSchema }, 'params'),
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['delete:sales']),
        async (req, res, next) => {
            const { saleId } = req.params
            try{
                const deletedSaleId = await salesService.deleteSale(saleId)
                res.status(200).json({ data: deletedSaleId, message: 'Sale deleted' })
            }catch(err){
                next(err)
            }
        }
    )
}

module.exports = salesRoutes
