//Arquivo de unificação de importação dos controllers

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
        .filter(file => ((file.indexOf('.')) !== 0 && (file !== "index.js")))
        .forEach( file => require(path.resolve(__dirname, file))(app))
}