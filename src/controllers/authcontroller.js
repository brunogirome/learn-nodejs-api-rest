// importando express
const express = require('express');
// importando o Schema de User
const User = require('../models/user');
//importanto bcrypt
const bcrypt = require('bcryptjs')

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
        if (await User.findOne({ email })) {
            return res.status(400).send({ error: 'User already exists' });
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
        return res.status(400).send({ error: 'Registration failed...' });
    }
});

//Rota de autenticação
router.post('/authenticate', async (req, res) => {
    //Ao entrar na rota, o req recebe o corpo da requisição e aqui é
    //realiada a desconstrução do objeto req
    const { email, password } = req.body;

    //Verificando se existe esse usuário com email no banco de Dados
    //FindOne, método do MongoDB!
    //Como password é definido no mongoose como select false, é 
    //necessário utilizar o +password para ele retornar o dado
    //para realizar a comparação
    const user = await User.findOne({ email }).select('+password')

    //Aparentemente o findOne retorna false caso não encontrar o 
    //dado, interessante!
    if (!user)
        return res.status(400).send({ error: 'User not found' })

    //Comparando o password descontruído e o password o usuário do
    //findone
    if (!await bcrypt.compare(password, user.password))
        return res.status(400).send({ error: 'Invalid password' })

    //Caso passe pelos doois ifs, retornar o usuário
    res.send({ user })
})

//aqui pelo o que entendi é que eu acabei bindando a rota router
// com uma rota auth
module.exports = app => app.use('/auth', router);