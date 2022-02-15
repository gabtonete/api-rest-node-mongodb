const md5 = require('md5');
const Usuario = require('../../models/Usuario');
const Tarefa = require('../../models/Tarefa');
const PerfilRepository = require('../PerfilRepository');

class MongoDBPerfilRepository {
    static async buscarUsuario(nome) {
        return await Usuario.find({nome: nome})
    }
    static async deletarPorIdESenha(filtro, senhaFiltro){

        const usuarioLogado = await Usuario.findOne(filtro)

        const senhaCodificada = md5(senhaFiltro)
        const senhaDb = usuarioLogado.senha

        if (senhaCodificada === senhaDb) {
            await Tarefa.deleteMany({filtro})
            await Usuario.deleteOne({filtro})
            return {msg: `${usuarioLogado.nome} deletado com sucesso, logue novamente`}

        } else {
            return {msg: "Senha informada inválida"}
        }
    }

}

module.exports = PerfilRepository(MongoDBPerfilRepository);