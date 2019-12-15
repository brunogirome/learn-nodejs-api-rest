// importando express
const express = require('express');
// importando o Schema de User
const User = require('../models/user');
//importanto bcrypt
const bcrypt = require('bcryptjs')
// import do JsonWebToken
const jwt = require('jsonwebtoken')
// import do crypto, para o token de forgot password
const crypto = require('crypto')
// importando o o mailer
const mailer = require('../../modules/mailer')


//Importando as configs de autenticação
const authConfig = require('../../config/auth.json')

//criando um Router
const router = express.Router();

//Função que gera o token
//"params": objeto com id do usuário passado como parâmetro
function generateToken(params = {}) {
    // Parâmetros: id do usuário, chave md5 utilizada na aplicação para tornar o token único,
    // expiresIn: Tempo em segundos para o token expirar. 86400 é equivalente a 1 dia :)
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400
    })
}

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
        //mongo, então ele tá buscando um email já cadastrado.
        //Daí como tem o return, se entrar nesse bloco de if,
        //ele automaticamente para o resto da execução
        if (await User.findOne({ email }))
            return res.status(400).send({ error: 'User already exists' });

        //tenho que olhar o await!
        // User.create é comando do Mongo, nada de mais!
        // o req.body é uma variável que contém todo o 
        // conteúdo da requisição, acredito que vem incorpada
        // com os dados de um form
        const user = await User.create(req.body);

        //pra senha não retornar, é necessário colocar undefined
        //nela
        user.password = undefined;
        return res.send({
            user,
            token: generateToken({ id: user.id })
        });
    } catch (err) {
        //criando um retorno de falha
        return res.status(400).send({ error: 'Registration failed...' });
    }
});

//Rota de autenticação
router.post('/authenticate', async (req, res) => {
    //Ao entrar na rota, o req recebe o corpo da requisição e aqui é
    //realiada a desconstrução do objeto req
    const { email, password } = req.body;

    //Verificando se existe esse usuário com email no Banco de Dados
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

    //Removendo o retorno do password no body do usuário
    user.password = undefined

    //Caso passe pelos dois ifs, retornar o usuário e o token!
    res.send({
        user,
        token: generateToken({ id: user.id })
    })
})

//Rota do "esqueci minha senha"
router.post('/forgotpassword', async (req, res) => {
    //Pegando o email da requisição do usuário
    const { email } = req.body

    //Envolvendo tudo em um try-cath para captura de erros retornando
    //pro usuário, e não para o prório node
    try {
        const user = await User.findOne({ email })

        if (!user)
            return res.status(400).send({ error: 'User not found' })

        //Gerando um token que autentique e crie uma segurança nessa requisição de
        //reset de password, adicionando um tempo de expiração e validação
        //O token aqui é gerado como String hexadecimal, com 20 caractéres
        const token = crypto.randomBytes(20).toString('hex')

        //Adicionando tempo de expiração para o token, no caso de uma hora
        const now = new Date()
        now.setHours(now.getHours() + 1)

        //Método do mongo, buscando pelo id e setando de acordo com o $set
        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now
            }
        })

        //Método do mailer
        //TO: endereço que receberá a mensagem
        //FROM: email que envia a mensagem
        //TEMPLATE: local do template que será utilizado dentro do 
        //contexto do mailer viewPath
        //CONTEXT: variáveis setadas no template entre {{ }}, no caso,
        //o template utilizado enviava o {{token}}
        //(err) verifica se ocorreu algum erro durante o envio
        //da mensagem de email, mas no final das contas é só uma função
        //anônima do JavaScript
        mailer.sendMail({
            to: email,
            from: 'naoresponda@email.com',
            template: 'auth/forgot_password',
            context: { token }
        }, (err) => {
            if (err)
                res.send.status(400).send({ error: 'Cannot send forgot password email' })

            return res.send()
        })

    } catch (err) {
        console.log(err)
        res.status(400).send({ error: 'Error on forgot password, please try again later' })
    }
})

router.post('/reset_password', async (req, res) => {
    const { email, token, password } = req.body

    try {
        //Trazendo o usuário com token de senha e a hora
        const user = await User.findOne({ email })
            .select('+passwordResetToken passwordResetExpires')

        //Caso o usuário não exista
        if (!user)
            return res.status(400).send({ error: 'User not found' })
            
        //Caso os tokens não sejam iguais
        if (token !== user.passwordResetToken)
            return res.status(400).send({ error: 'Invalid password reset token' })
            
        //Caso o token expire
        if (new Date() > user.passwordResetExpires)
                return res.status(400).send({ error: 'Token expired' })

        //Setando a nova senha. Já que no model de user tem as configurações
        //de encriptação, não é necessário encriptar aqui também.
        user.password = password;

        //Dando um commit no update?
        await user.save()

        //O res.send() por padrão envia status 200, pra dizer que está tudo ok.
        //pelo visto é importante sempre enviar uma resposta, para finalizar a
        //requisição.
        res.send()

    } catch (err) {
        res.status(400).send({ error: 'Cannont reset password, try again' })
    }
})

//  aqui pelo o que entendi é que eu acabei bindando a rota router
// com uma rota auth
module.exports = app => app.use('/auth', router);