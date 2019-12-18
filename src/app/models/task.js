//Importação do mongoose
const mongoose = require('../../database')

const TaskSchema = new mongoose.Schema({
    tittle: {
        type: String,
        required: true
    },
    //Associando um projeto à tarefa
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Projects',
        required: true
    },
    //Associando um usuário à tarefa
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    completed: {
        type: Boolean,
        deafult: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Task = mongoose.model('Task', TaskSchema)

module.exports = Task
