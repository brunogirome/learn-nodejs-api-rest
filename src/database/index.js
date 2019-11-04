// Arquivo responável pelo gerenciamento de conexões do banco de dados

// importando o mongoose
const mongoose = require('mongoose');

// definindo o endereço do banco de dados. O NewUrlParser cria uma database com
// o nome caso ela não exista! useMongoCliente parece ser um gerenciador de conexão com
// o mongodb
mongoose.connect('mongodb://localhost:27017/noderest', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true   
});

// classe de promise do mongoose. Pelo o menos isso é padrão, não precisa entender
// muito bem... .🤔
mongoose.Promise = global.Promise;

// tornando o mongoose público!
module.exports = mongoose;
