# Aprendendo a criar uma API com NodeJS, Express e MongoDB

- Vídeo da primeira aula: <https://www.youtube.com/watch?v=BN_8bCfVp88>

## Aula 1

### NodeJS

**First things first:**

Lista de comandos utilizados para criação da aplicação & pacotes adicionais:

```bash
    #utilizado para iniciar a aplicação e a instalação do package.json
    npm init

    #####pacotes extras instalados utilizando o Yarn:######

    #framework de Node para trativas de rotas de requests HTTP 🤔
    yarn add express

    #pacote que auxilia o node a entender requisições recebendo a informação em json,
    #recebendo a informação via URL. Semalhante ao método GET do PHP.
    yarn add body-parser

    #pacote do mongodb
    yarn add mongoose

    #biblioteca de incriptação
    yarn add bcryptjs
```

### Criando rota básica

Exemplo de rota simples criada com o express:

```javascript
    // criando rota simples. O primeiro parâmetro ('/') é a rota do qual eu quero ouvir
    // req = dados de requesição, token de autenticação e etc
    // res é a resposta do usuáro
    app.get('/', (req, res) => {
        res.send('Hello World');
    });
```

### MongoDB

Iniciar o mongoDB é muito simples (muito mesmo). Para iniciar o serviço no terminal, basta digitar `mongo`. Para criar uma base de dados, basta digitar o seguinte comando:

```mongodb
    use dataBaseName
```

> Detalhe que o mongo utiliza o caminho `mongodb://localhost:27017/` por padrão.;

Uma pasta interessante da estrutura do banco de dados é a `model`. Nela ficam de fato os modelos do banco de dados utilizado na aplicação, como as classes de getters e setters do modelo MVC ou uma tablea do MySQL.

Os Models em si são chamados de `Schema`. É bem parecido com Typescript, isso se não for alguma maluquice dessas!

Um modelo de schema seria:

```javascript
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false
        // Esse select: false defite se caso a gente buscar
        // essa informação na DB, se ela deve retornar ou
        // não. Bem interessante!
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
```

## Aula 2

### JWT (Json Web Token)

É um token criptografado utilizado para autenticação do usuário.

```javascript
    //Função que cria o token
    //"params": objeto com id do usuário passado como parâmetro
    function generateToken ( params = {}) {
    // Parâmetros: id do usuário, chave md5 utilizada na aplicação para tornar o token único,
    // expiresIn: Tempo em segundos para o token expirar. 86400 é equivalente a 1 dia :)
    return jwt.sign(params,   authConfig.secret, {
            expiresIn: 86400
        })
    }
```

**JsonWebToken:** Pacote do node de autenticação via Token (JWT).

```bash
    yarn add jsonwebtoken
```

### Outros

**FindOne:**

```javascript
    //Aparentemente o findOne retorna false caso não encontrar o
    //dado, interessante!
    const user = await User.findOne({ email }).select('+password')

    if (!user)
        return res.status(400).send({ error: 'User not found' })
```

### Middleware

Parada do Express, ele intercepta o controller e as rotas... Antes da rota entrar no controller, ele verifica uma requisição. Ou seja, a entrada do req é verificada pelo middleware pra depois executar os comandos da controller.

Legal que caso tu fale pro router utilizar um middleware antes do comando de fato que tu quer executar, ele vai lógicamente executar o router e só depois rodar a requisição do controller. Claro que, isso acontece pelo simples fato do Middleware vir antes na ordem de execução do código, e caso dê erro lá dentro, ele já corta o resto da navegação do usuário dentro da api, app, ou sei lá o que.

```javascript
    //importanto o middleware
    const authMiddleware = require('../middlewares/auth')

    //Travando essa rota a um middleware!
    router.use(authMiddleware)

    router.get("/", (req, res) => {
        res.send({ ok: true })
    })
```

## Aula 3

Adicionada mais bibliotecas:

```bash
    #fs: Filesystem, adiciona ao node a possibilidade de ler arquivos
    #path: Path, serve para trabalhar com caminhos de pasta
    #nodemailer: pacote de emails do node
    #nodemailer-express-handlebars: pacote para trabalar com templates de email
    yarn add fs path nodemailer nodemailer-express-handlebars
```

Para realizar os testes de e-mail, foi utilizado o site [MailTrap](https://mailtrap.io/).

Ferramentas de e-mail do mundo real, de acordo com o vídeo de 2017:

- SparkPost
- MailChimp
- SendGird
- Mandrill

### Utilizando o FileSystem para criar um index de importação de todos os arquivos de dentro de uma pasta

Com o FileSystem e o Path, é possível varrer todos os arquivos dentro de uma determinada pasta e criar alguma instrução que utilize caminhos para realizar uma operação. No caso, foi utilizado o `forEach` onde é feita a varredura da pasta e, assim, criando uma instrução de require para todos os arquivos de dentro dela.

A mágica é que se programa apenas uma vez esse index de importação, e assim todo arquivo criado ou deletado não cria uma necessidade de manuntenção de imports/requires em nenhum outro código!

```javascript
    //importando o filesystem
    const fs = require('fs')
    //importando o path
    const path = require('path')

    module.exports = app => {
        //Falando pro filesystem ler um diretório
        //READSYNC: indica este diretório
        //FILTER: filtragem de arquivo. No caso, indexOf
        //filtra se o primeiro caracter for um ponto (.),
        //já que esses arquivos são geralmente arquivos de
        //configuração e relacionados, e depois ele filtra
        //este mesmo arquivo, o 'index.js'
        //FOREACH: usando o forEach com uma função anônima, é
        //possível sair dando require de cada um dos arquivos
        //dentro da pasta __dirname, no caso, a própria pasta
        //do arquivo.
        //Logo, este arquivo ficou como um index de fato de
        //todos os outros controllers da aplicação!
        fs
            .readdirSync(__dirname)
            .filter(file => ((file.indexOf('.')) !== 0 && (file !== 'index.js') ))
            .forEach( file => require(path.resolve(__dirname, file))(app))
    }
```

### FindByIdAndUpdate (Mongo)

Alterando um dado de um arquivo de acordo com seu id, executando o `FindByIdAnd...`, onde `...` pode ser Update, Delete ou Remove.

```javascript
    //Método do mongo, buscando pelo id e setando de acordo com o $set
    await User.findByIdAndUpdate(user.id, {
        '$set': {
            passwordResetToken: token,
            passwordResetExpires: now
        }
    })
```

## Aula 4

### Eager Loading (Relacionamentos no MongoDB)

No exemplo que foi dado, quando acessamos a rota de visualização de todos os projetos, é retornado apenas o id do usuário. Uma maneria lógica de realizar a busca dos dados do usuário seria criando uma query separada para o retorno do id do usuário, correto? Talvez.
Caso tivessemos 10.000 projetos cadastrados, teríamos que executar 10.001 querrys, já que seria uma query para buscar todos os projetos e 10.000 para cada usuário.
Para isso, existe essa parada aí chamada Eager. Com o eager, conseguimos realizar a mesma operação, porém com apenas 2 querys.

```javascript
    //Assim, teria o retorno de todos os projetos mas
    //sem os relacionamentos, retornaria apenas o id
    //do usuário, como exemplo
    const projects = await Project.find()

    //Com o populate, é possível retornar todos os dados do
    //usuário que é relacionado na chave user!
    const projects = await Project.find().populate('user')
```
