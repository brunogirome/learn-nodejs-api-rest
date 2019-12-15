//imports
const express = require('express')
//middleware, porta de entrada do app
const authMiddleware = require('../middlewares/auth')

const router = express.Router()

//Travando essa rota a um middleware!
router.use(authMiddleware)

router.get("/", (req, res) => {
    res.send({ ok: true })
})

// Exportando função app.use injetando o app da index
// do root
module.exports = app => app.use('/projects', router)