const PerfilRepository = require("../repositories/impl/MongoDBPerfilRepository");

class PerfilService {
    buscarPerfil(usuarioNome) {
        return PerfilRepository.buscarUsuario(usuarioNome)
    }
    deletarPerfil(idLogado, senhaBody) {

        const erros = []
        if(!idLogado) {
            erros.push("ID do usuário obrigatória")
            return {erros}
        }

        const filtro = {
            _id: idLogado,
        }

        const senhaFiltro = senhaBody

        return PerfilRepository.deletarPorIdESenha(filtro, senhaFiltro)
    }
}

module.exports = PerfilService;