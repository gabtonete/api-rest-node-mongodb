const HttpController = require('./HttpController');
const LoginService = require('../services/LoginService');

class LoginController extends HttpController {
    // Mais uma vez o controller herda o basecontroller e define uma rota própria
    // Escolhendo qual o método http (post), e qual a função relativa à ele (login)
    setupRoutes(baseUrl) {
        this.express.post(`${baseUrl}/login`, this.login.bind(this));
        this.express.get(`${baseUrl}/login`, this.mostrar.bind(this));
    }

    mostrar(req, res)  {
        return res.status(200).json({msg: 'usuário logado'})
    }

    async login(req, res) {

        // guarda na const body os valores do body
        const body = req.body;
        try {
            // valida se os dados recebidos do body são coerentes
            if (!body || !body.login || !body.senha) {
                req.logger.info('requisição de login inválida!');
                return res.status(400).json({
                    status: 400,
                    erro: "Parâmetros de entrada inválidos"
                });
            }

            // na const service, instanciamos um objeto LoginService(), pois ele possuirá os métodos dessa classe
            const service = new LoginService();

            // Na const resultado guardamos o resultado do método logar passando como parâmetros login e senha recebidos no body
            // O service fará a regra de negócio que irá acionar o repository para buscar no banco de dados e confirmar se o login e senha existem
            // e se fazem parte da mesma tabela
            // Caso faça, ele irá buscar os dados relevantes para nós como ID, nome e email, e também gerará um token
            // devolvendo para essa variável esses 4 dados
            const resultado = await service.logar(body.login, body.senha);

            if (!resultado) {
                res.status(400).json({
                    erro: "Login ou senha inválidos",
                    status: 400
                });
            }

            req.logger.info('requisição de login realizada com sucesso', `resultado=${JSON.stringify(resultado)}`);
            
            // Por fim devolve os dados do banco no res e mostra sucesso.
            res.json(resultado);

        } catch (e) {
            req.logger.error("erro ao realizar login, erro=" + e.message);

            res.status(500).json({
                erro: "Problema ao realizar login, tente novamente mais tarde",
                status: 500
            });
        }
    }
}

module.exports = LoginController;