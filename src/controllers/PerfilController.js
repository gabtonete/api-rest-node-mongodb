const PerfilService = require('../services/PerfilService');
const HttpController = require('./HttpController');

class PerfilController extends HttpController {
    setupRoutes(baseUrl) {
        this.express.post(`${baseUrl}/buscar`, this.buscarUsuario.bind(this));
        this.express.get(`${baseUrl}/perfil`, this.informar.bind(this));
        this.express.post(`${baseUrl}/perfil`, this.deletarPerfil.bind(this));
    }

    async buscarUsuario(req, res) {
        try {
            const usuarioNome = req.body.nome;
            const service = new PerfilService();
            const result = await service.buscarPerfil(usuarioNome);
            res.json(result)
        } catch {

        }
    }

    informar(req, res) {
        try {
            res.json({ msg: " Você está logado " });

        } catch (e) {
            req.logger.error("erro ao informar perfil, erro=" + e.message);

            req.status(500).json({
                erro: "Problema ao informar perfil, tente novamente mais tarde",
                status: 500
            });
        }
    }

    async deletarPerfil(req, res) {
        try {
            const idLogado = req.usuario.id;
            const senhaBody = req.body.senha;

            const service = new PerfilService();

            const resp = await service.deletarPerfil(idLogado, senhaBody);

            res.json(resp)
        } catch {
            req.logger.error("erro ao excluir conta, erro=" + e.message);

            req.status(500).json({
                erro: "Problema ao excluir conta, tente novamente mais tarde",
                status: 500
            });
        }
    }
}

module.exports = PerfilController;