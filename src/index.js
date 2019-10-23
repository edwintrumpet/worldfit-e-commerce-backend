const express = require('express')
const { config } = require('./config')
const products = require('./routes/products')

const app = express()

app.use(express.urlencoded({extended: false}));
app.use(express.json())

// Routes
products(app)

app.listen(config.port, () => {
    console.log(`Server on http://localhost:${config.port}`)
})
