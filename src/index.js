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

//incorpando a instância do app dentro do authcontroller
require('./controllers/authcontroller')(app);
//rodando o app.get lááaá da projectController, passando o app como
//parâmetro, então meu eu do passado não estava tão errado
require('./controllers/projectController')(app);

//selecionando a porta da aplicação!
app.listen(3000);