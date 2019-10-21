const express = require('express')
const { config } = require('./config')

const app = express()

app.get('/', (req, res) => {
    res.status(200).json({message: 'Api works!'})
})

app.listen(config.port, () => {
    console.log(`Server on http://localhost:${config.port}`)
})