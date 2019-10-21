const express = require('express')

function myRoutes(app) {
    const router = express.Router()
    app.use('/api', router)

    router.get('/', (req, res) => {
        res.status(200).json({message: 'Routes works!'})
    })
}

module.exports = myRoutes