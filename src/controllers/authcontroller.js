// importando express
const express = require('express');
// importando o Schema de User
const User = require('../models/user');

//criando um Router
const router = express.Router();

//rota de cadastro
// req: requisção, res: a resposta!
// async define método com assíncrono. Ou seja, ele se torna
// uma promise. OU SEJA!!: fica pra ser executado depois,
// primeiro o código dá prioridade de executar o resto da 
// app e depois ele volta nesse método, quando estiver pronto.
// Geralmente é utilizado para tarefas mais pesadas.
router.post('/register', async (req, res) => {
    //creio que essa seja a descontrução do email
    const { email } = req.body;

    try {
        //tenho quase certeza que o findOne é um método do próprio
        //mongo, então ele tá buscando um email já cadastrado
        //daí como tem o return, se entrar nesse bloco de if
        //ele automaticamente para o resto da execução
        if ( await User.findOne({ email }) ) {
            return res.status(400).send({ error: 'User already exists'});
        }
        
        //tenho que olhar o await!
        // User.create é comando do Mongo, nada de mais!
        // o req.body é uma variável que contém todo o 
        // conteúdo da requisição, acredito que vem incorpada
        // com os dados de um form
        const user = await User.create(req.body);
    
        //quando a gente cria um registro no mongo, pelo o que
        //eu entendi, ele retorna diretamente esse dado pra gente
        //pra senha não retornar, é necessário colocar undefined
        //nela
        user.password = undefined;
        return res.send({ user });
    } catch (err) {
        //criando um registrador de falha
        return res.status(400).send({ error: 'Registration failed...'});
    }
});

//aqui pelo o que entendi é que eu acabei bindando a rota router
// com uma rota auth
module.exports = app => app.use('/auth', router);