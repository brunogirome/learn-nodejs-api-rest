// importando o express
const express = require ('express'); 
// importando o bodyParser
const bodyParser = require ('body-parser'); 

// criando a aplicação, criando o seu core.
const app = express(); 

// informando a aplicação para usar o bodyParser com json
app.use(bodyParser.json());
// algo haver com receber informação via URL
app.use(bodyParser.urlencoded({ extended: false }));

// importando os controllers via o index!
require('./app/controllers/index')(app)

//selecionando a porta da aplicação!
app.listen(3000);
