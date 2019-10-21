const express = require('express')
const { config } = require('./config')
const myRoutes = require('./routes')

const app = express()

myRoutes(app)

app.listen(config.port, () => {
    console.log(`Server on http://localhost:${config.port}`)
})
