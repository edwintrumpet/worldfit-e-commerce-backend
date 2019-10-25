const express = require('express')
const { config } = require('./config')
const productsRoutes = require('./routes/products')
const authRoutes = require('./routes/auth')

const app = express()

app.use(express.urlencoded({extended: false}));
app.use(express.json())

// Routes
authRoutes(app)
productsRoutes(app)
app.listen(config.port, () => {
    console.log(`Server on http://localhost:${config.port}`)
})
