//imports
const express = require('express')
//middleware, porta de entrada do app
const authMiddleware = require('../middlewares/auth')
//importando o Schema do project
const Project = require('../models/projects')
//importando o Schema do task
const Task = require('../models/task')

const router = express.Router()

//Travando essa rota a um middleware!
router.use(authMiddleware)

//Rota de listagem de projetos
router.get("/", async (req, res) => {
    try {
        //Retornando todos os projetos
        const projects = await Project.find().populate('user')

        return res.send({ projects })
    } catch (err) {
        return res.status(400).send({ error: 'Error while loading projects' })
    }
})

//Acho que os dois pontos indica que o valor que virá será flexível
router.get('/:projectId', async (req, res) => {
    try {
        //Retornando projeto baseado no id
        //req.params.projectId deve pegar o :projectId 🤔
        const project = await Project.
            findById(req.params.projectId).
            populate('user')

        return res.send({ project })
    } catch (err) {
        console.log(err)
        return res.status(400).send({ error: 'Error while loading the project' })
    }
})

//Rota de cadastro
router.post('/', async (req, res) => {
    try {
        //Pegando o corpo da nossa requisção (em json, no caso) e 
        //executando o create do mongoose com base no schema de 
        //projetos!
        //No final, foi enviado como parâmetro user, o id do req,
        //onde tem o id do usuário
        const project = await Project.create( { ...req.body, user: req.userId })

        return res.send({ project })
    } catch (err) {
        return res.status(400).send({ error: 'Error while creating a new project' })
    }
})

//Rota de atualizações
router.put('/:projectId', async (req, res) => {
    res.send({ user: req.userId })
})

//Rota de delete
router.delete('/:projectId', async (req, res) => {
    try {
        //Deletando um projeto baseado no id
        await Project.findByIdAndRemove(req.params.projectId)

        return res.send()
    } catch (err) {
        console.log(err)
        return res.status(400).send({ error: 'Error while deleting the project' })
    }
})

// Exportando função app.use injetando o app da index
// do root
module.exports = app => app.use('/projects', router)