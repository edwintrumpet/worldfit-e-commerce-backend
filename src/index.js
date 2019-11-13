const express = require('express')
const cookieParser = require('cookie-parser')
const debug = require('debug')('app:server')
const { config } = require('./config')
const authApi = require('./routes/auth')
const productsRoutes = require('./routes/products')
const usersRoutes = require('./routes/users')
const { logErrors, wrapErrors, errorHandler } = require('./utils/middlewares/errorHandlers')
const notFoundHandler = require('./utils/middlewares/notFoundHandler')

const app = express()
app.use(cookieParser())

app.use(express.urlencoded({extended: false}));
app.use(express.json())

// Routes
authApi(app)
usersRoutes(app)
productsRoutes(app)
app.use(notFoundHandler)

// Error middlewares
app.use(logErrors)
app.use(wrapErrors)
app.use(errorHandler)

app.listen(config.port, () => {
    debug(`Server on http://localhost:${config.port}`)
})
