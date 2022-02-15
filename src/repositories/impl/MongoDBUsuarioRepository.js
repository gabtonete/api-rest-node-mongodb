const UsuarioRepository = require('../UsuarioRepository');
const Usuario = require('../../models/Usuario'); // O model com o métodos .model() do mongoose para criação da collection no Atlas

const transformarUsuario = (usuarioDB) => {
    return {
        id: usuarioDB._doc._id.toString(),
        nome: usuarioDB._doc.nome,
        email: usuarioDB._doc.email,
    }
}

class MongoDBUsuarioRepository {
    // Método create usando parâmetros que serão recebidos no controller UsuarioController.js
    // Esse método cadastrar() utiliza o objeto Usuario (model) e devolve pro Schema os dadosUsuario (que virá do body) cadastrando assim na collection usuario
    // ->> UsuarioService.js para fazer a regra de negócio que filtra o nome/email/senha
    static cadastrar(dadosUsuario) {
        return Usuario.create(dadosUsuario);
    }

    // Encontra no banco de dados um valor que seja igual ao filtro (parâmetro) passado
    // Pode ser usado para buscar login/senha, ou quem sabe um email já cadastrado
    // O parâmetro filtro é um parâmetro vazio, podendo ser passado qualquer coisa dentro dele, desde que esteja de acordo com os atributos do Usuario
    static async filtrar(filtro = {}) {
        let usuarios = await Usuario.find(filtro);

        if (usuarios) {
            usuarios = usuarios.map(u => transformarUsuario(u));

            return usuarios;
        }
    }

    static async buscarPorId(idUsuario) {
        const usuarioDB = await Usuario.findById(idUsuario);
        if (usuarioDB) {
            return transformarUsuario(usuarioDB)
        }

        return null;
    }
}

module.exports = UsuarioRepository(MongoDBUsuarioRepository);