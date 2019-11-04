// Importando o mongoose
const mongoose = require('../database');
// importando a biblioteca de incriptação
const bcrypt = require('bcryptjs')

//Criando um Schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false 
        // não retorna caso a gente faça uma busca no banco
        // de dados
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

//.pre significa que algo deve acontecer antes de ser 
// salvo os dados
UserSchema.pre('save', async function(next) {
    //this se refere ao UserSchema, que será salvo no banco
    // de dados
    // o parmâentro depois do campo que vai ser incriptado
    // (no caso, 10), é o número de vezes que eu quero que
    // o campo seja re-incriptado
   const hash = await bcrypt.hash(this.password, 10);
   //atribuindo o password ao novo password gerado à cima
   this.password = hash;

   //não sei o que faz, lel
   next();
});

//definindo que o nossa var User é um model do mongodb
const User = mongoose.model('User', UserSchema);

module.exports = User;