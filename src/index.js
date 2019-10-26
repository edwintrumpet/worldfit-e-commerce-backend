const express = require('express')
const { config } = require('./config')
const productsRoutes = require('./routes/products')
const authRoutes = require('./routes/auth')
const { logErrors, wrapErrors, errorHandler } = require('./utils/middlewares/errorHandlers')
const notFoundHandler = require('./utils/middlewares/notFoundHandler')

const app = express()

app.use(express.urlencoded({extended: false}));
app.use(express.json())

// Routes
authRoutes(app)
productsRoutes(app)
app.use(notFoundHandler)

// Error middlewares
app.use(logErrors)
app.use(wrapErrors)
app.use(errorHandler)

app.listen(config.port, () => {
    console.log(`Server on http://localhost:${config.port}`)
})
