# Aprendendo a criar uma API com NodeJS, Express e MongoDB

- Agradecimentos à Rocketseat: <https://www.youtube.com/watch?v=BN_8bCfVp88>

## NodeJS

**First things first:**

Lista de comandos utilizadas para criação da aplicação & pacotes adicionais:

```bash
    npm init #utilizado para iniciar a aplicação e a instalação do package.json

    #pacotes extras instalados utilizando o Yarn:

    yarn add express #framework de Node para trativas de rotas de requests HTTP 🤔

    yarn add body-parser #pacote que auxilia o node a entender requisições recebendo a informação
                         #em json, recebendo a informação via URL. Semalhante ao método GET do PHP

    yarn add mongoose #pacote do mongodb

    yarn add bcryptjs #biblioteca de incriptação
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

## MongoDB

Iniciar o mongoDB é muito (muito mesmo) simples. Para iniciar o serviço no terminal, basta digitar `mongo`. Para criar uma base de dados, basta digitar o seguinte comando:

```mongodb
    use dataBaseName
```

> Detalhe que o mongo utiliza a porta **":27017"**;

---

> A programação relacionada ao mongoDB estão na pasta `src/index.js`.

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
