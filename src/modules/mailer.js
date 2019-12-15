const path = require('path')
const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')

//Desestruturando o json
const { host, port, user, pass } = require('../config/mail.json')

//Método do mailtrap
const transport = nodemailer.createTransport({
    host,
    port,
    auth: { user, pass }
});

//Criando o compilador de email? Viewpath eu acredito que seja
//o local onde ficam as templates, ex: template de rec. de senha,
//boas vindas, nova mensagem e etc.
//extName é a extensão do arquivo. No caso, html mesmo, simplão.
transport.use('compile', hbs({
    viewEngine: {
        extName: '.html',
        partialsDir: path.resolve('./src/resources/mail/'),
        layoutsDir: path.resolve('./src/resources/mail/'),
        defaultLayout: undefined
    },
    viewPath: path.resolve('./src/resources/mail/'),
    extName: '.html'
}))


module.exports = transport