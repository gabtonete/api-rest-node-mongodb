const HttpController = require('./HttpController');
const UsuarioService = require('../services/UsuarioService');


class UsuarioController extends HttpController {
    // Todo controller irá extender do BaseController, ele possui uma rota já predefinida como base
    // e uma instância do express, para que seja definida a rota desse controller
    setupRoutes(baseUrl) {
        this.express.post(`${baseUrl}/usuario`, this.cadastro.bind(this));
    }

    // A função que será executada ao entrar na route /usuario (POST)
    async cadastro(req, res) {

        // Guardados os dados do body numa const
        const dadosUsuario = req.body;

        try {

            // Ao instanciar um objeto do UsuarioService, obtemos o método cadastrar, que é responsável por filtrar e salvar os dados que vieram do body no banco
            const servico = new UsuarioService();

            // Essa const irá acessar o método .cadastrar() do service, passando como parâmetro os dados que vieram do body (incluso dados required:true)
            const retornoService = await servico.cadastrar(dadosUsuario);

            // Filtro para saber se o retorno do cadastro na const retornoService funcionou
            if (retornoService.erros) {
                return res.status(400).json({
                    status: 400,
                    erro: retornoService.erros.join(',')
                });
            }
            
            // Em caso de true, o usuário é criado no banco de dados
            req.logger.info('usuário cadastrado com sucesso');
            return res.json({
                msg: 'Usuário criado com sucesso!',
            });

        } catch (error) {
            req.logger.error('erro ao cadastrar o usuário, error=' + error.message);
            res.status(500).json({
                erro: 'Ocorreu um erro ao cadastrar o usuário',
                status: 500
            })
        }
    }
}

module.exports = UsuarioController;