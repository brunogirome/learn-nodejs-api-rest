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
        const projects = await Project.find().populate(['user', 'tasks'])

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
            populate(['user', 'tasks'])

        return res.send({ project })
    } catch (err) {
        return res.status(400).send({ error: 'Error while loading the project' })
    }
})

//Rota de cadastro
router.post('/', async (req, res) => {
    try {
        //Desconstruindo a requisição em tittle, description e tasks
        const { tittle, description, tasks } = req.body

        //Criando o objeto de requisição, pique MVC por causa do mongoose
        const project = await Project.create({ tittle, description, user: req.userId })

        //Quando se utiliza o Object.create, o mongoose automaticamente cria a variável e já
        //injeta ela no banco de dados, como se já estivesse executnado o comando
        //Já o new Object apenas cria a variável baseada no Schema do mongoose, pique MVC
        //Legal também que, o ...task faz com que o objeto receba todos os atributos que vem
        //do objeto task da requisição, e é inserido o id depois porque o Project já foi
        //criado
        //O Promise.all() faz com que todo esse trecho de código execute antes do próximo await
        await Promise.all(tasks.map(async task => {
            const projectTask = new Task({ ...task, project: project.id })

            //O save retorna uma promisse!
            //Até onde eu sei o push adiciona um dado ao Array, então eu pego o project
            //que eu acabei de criar lá em cima, e adiciono a task no array do projeto
            await projectTask.save()
            project.tasks.push(projectTask)
        }))

        //É, e depois eu tenho que salvar a alteração no mongoose
        await project.save()

        return res.send({ project })
    } catch (err) {
        console.log(err)
        return res.status(400).send({ error: 'Error while creating a new project' })
    }
})

//Rota de atualizações
router.put('/:projectId', async (req, res) => {
    try {
        const { tittle, description, tasks } = req.body

        // new true: ele retorna o projeto atualizado
        const project = await Project.findByIdAndUpdate(req.params.projectId,
            {
                tittle,
                description
            }, {new: true})

        //Removendo todas as tasks associadas a esse projeto
        project.tasks = []
        await Task.remove({ project: project._id })

        await Promise.all(tasks.map(async task => {
            const projectTask = new Task({ ...task, project: project.id })

            await projectTask.save()
            project.tasks.push(projectTask)
        }))

        await project.save()

        return res.send({ project })
    } catch (err) {
        console.log(err)
        return res.status(400).send({ error: 'Error while updating a new project' })
    }
})

//Rota de delete
router.delete('/:projectId', async (req, res) => {
    try {
        //Deletando um projeto baseado no id
        await Project.findByIdAndRemove(req.params.projectId)

        return res.send()
    } catch (err) {
        return res.status(400).send({ error: 'Error while deleting the project' })
    }
})

// Exportando função app.use injetando o app da index
// do root
module.exports = app => app.use('/projects', router)