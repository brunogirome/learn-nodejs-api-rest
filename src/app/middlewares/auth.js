//JsonWebToken
const jwt = require('jsonwebtoken')
//Importando o nosso secret, palavra chave da aplicação
const authConfig = require('../../config/auth.json')

// Intercepta a entrada do usuário até o controller, que é
// o "coração" da aplicação
module.exports = (req, res, next) => {
    // Recebendo do header da requisição uma authorization
    const authHeader = req.headers.authorization

    // Verificando se foi enviado um token de autorização,
    // já que o authHeader retorna false caso não for informado
    // um token de autorização
    if (!authHeader)
        return res.status(401).send({ error: 'No token provied' })

    // Um token jwt tem o formato: Bearer d077f244def8a70e5ea758bd8352fcd8,
    // logo, a String é splitada com o espaço em duas partes
    // diferentes
    const parts = authHeader.split(' ')

    //Daí, caso estiver no formato "Bearer hashmd5", ou seja,
    //for encontrada dois elementos no vetor parts, ok, prossegue,
    //se não... Retorna um erro. 
    //(Mais pra frente, utilizaremos esses dois elementos 
    //separadamente)
    if (!parts.lenght === 2)
        return res.status(401).send({ error: 'Token error' })

    //Desestruturando um vetor! Javascript é incrível
    const [ scheme, token ] = parts

    //Verificando se a primeira parte do authHeader começa
    //com Bearer, ou algo semelhante
    //Esses símbolos em volta do Bearer, é uma parada chamada
    //Regex. Parece expressões regulares, e provavelmente
    //é mesmo. 🤔
    // / : começando a regex, ^ : início da regex, $ : final
    // / : termina, i : case INsensitive
    if ( ! /^Bearer$/i.test(scheme)) 
        return res.status(401).send({ error: 'Token malformatted' })
    
    //Pra evitar processamento descenessário, é interessante
    //realizar verificações mais tranquilas antes de partir
    //para a verficação jwt, pra poupar trabalho, basicamente
    //Token, é o token que vem do cliente e que foi splitado
    //lá em cima, authC.secret, palavra chave da aplicação.
    //A função atribui um erro, se tiver um erro, e o id do usário
    //caso dê tudo certo. err é booleano, inclusive!
    jwt.verify(token, authConfig.secret, (err, decoded) => {
        //Caso o token não bater com as informações de autenticação
        if (err)
            return res.status(401).send({ error: 'Invalid token' })
        
        //Caso cheguemos até aqui, pegamos o id do usuário
        //e utilizamos ele no resto da aplicação, nos outros
        //controllers e etc
        //Atribuindo o id da requisição como o id decodificado, ou algo assim.
        //Hmm, acredito que ele altera o dados incorporados da requisição.
        req.userId = decoded.id
        //Como chegamos no final da autenticação, agora é só prosseguir para
        //o controller desejado, utilizando o next
        return next()
    })

};