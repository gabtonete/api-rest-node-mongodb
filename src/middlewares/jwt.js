const jwt = require('jsonwebtoken');
const UsuarioRepository = require('../repositories/impl/MongoDBUsuarioRepository');

// Define quais rotas serão públicas para o programa
const rotasPublicas = [{
        url: '/api/login',
        method: 'POST'
    },
    {
        url: '/api/docs/*',
        method: 'GET'
    },
    {
        url: '/api/usuario',
        method: 'POST'
    },
    {
        url: '/api/buscar',
        method: 'POST'
    }
];

module.exports = (req, res, next) => {
    req.logger.info(`verificando permissão de acesso a rota ${req.url}`);

    // Utilizando o request, busca o URL e o método da rota, se for igual a algum valor das rotasPublicas, será retornado para rotaPublica
    const rotaPublica = rotasPublicas.find(rota =>
        (
            rota.url === req.url ||
            (
                rota.url.indexOf('*') !== -1 &&
                req.url.indexOf(rota.url.replace('*', '')) !== -1
            )
        ) &&
        (rota.method === req.method.toUpperCase())
    )

    if (rotaPublica || req.method.toUpperCase() === 'OPTIONS') {
        req.logger.info('rota pública, acesso liberado');
        return next();
    }

    // Se a rota não for pública, procurará no header Authorization se existe algum valor
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).json({
            status: 401,
            erro: 'acesso negado, você precisa enviar o header authorization'
        });
    }

    // Caso existe, armazena numa const token o valor do token sem o 'Bearer' (índice 8)
    const token = authorization.substr(7);
    if (!token) {
        return res.status(401).JSON({
            status: 401,
            erro: 'Acesso negado, o token é inválido'
        });
    }

    // O método verify do jwt pega o token e a  chave secreta e o decodifica
    jwt.verify(token, process.env.SECRET_JWT, async(erro, decoded) => {
        if (erro) {
            req.logger.error('erro ao decodificar o token jwt', 'token=', token);
            return res.status(401).json({
                status: 401,
                erro: 'acesso negado, problema ao decodificar o seu token de autorização'
            });
        }

        // Se a decodificação funcionar, devolve a claim usada na geração do token (id)
        req.logger.debug('token jwt decodificado', `idUsuario=${decoded._id}`);

        const usuario = await UsuarioRepository.buscarPorId(decoded._id);
        if (!usuario) {
            req.logger.error('usuário não encontrado na base', `id=${decoded._id}`)
            return res.status(401).json({
                status: 401,
                erro: 'acesso negado, usuário não encontrado na db'
            });
        }

        req.usuario = usuario;
        next();
    });
}