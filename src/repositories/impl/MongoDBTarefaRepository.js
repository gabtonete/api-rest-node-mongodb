const TarefaRepository = require('../TarefaRepository');
const Tarefa = require('../../models/Tarefa');

const StatusTarefa = require('../../enum/StatusTarefa');

const transformarTarefa = (tarefaBD) => {
    return {
        id: tarefaBD._doc._id,
        nome: tarefaBD._doc.nome,
        dataPrevistaConclusao: tarefaBD._doc.dataPrevistaConclusao,
        dataConclusao: tarefaBD._doc.dataConclusao,
        idUsuario: tarefaBD._doc.idUsuario
    }
}

class MongoDBTarefaRepository {
    static cadastrar(dados){
        return Tarefa.create(dados);
    }

    static editar(id, dados) {
        return Tarefa.findByIdAndUpdate(id, dados)
    }

    static deletar(id) {
        return Tarefa.findByIdAndDelete(id)
    }

    static async filtrar({
        periodoDe,
        periodoAte,
        status,
        idUsuario
    }) {
        const query = {
            idUsuario
        }

        if(periodoDe && periodoDe.trim()) {
            const dataPeriodoDe = new Date(periodoDe);
            query.dataPrevistaConclusao = {
                $gte: dataPeriodoDe
            } 
        }

        if(periodoAte && periodoAte.trim()) {
            const dataPeriodoAte = new Date(periodoAte);
            if(!query.dataPrevistaConclusao) {
                query.dataPrevistaConclusao = {};
            }

            query.dataPrevistaConclusao.$lte =  dataPeriodoAte
        }

        if (status && status.trim()) {
            const statusInt = parseInt(status);
            if (statusInt === StatusTarefa.EM_ABERTO) {
                query.dataConclusao = null;
            } else if (statusInt === StatusTarefa.CONCLUIDO) {
                query.dataConclusao = {
                    $ne: null
                };
            }
        }

        const tarefas = await Tarefa.find(query);
        if(tarefas) {
            return tarefas.map(t => transformarTarefa(t));
        }

        return [];
    }

    static async buscarPorId(idTarefa) {
        const tarefaDB = await Tarefa.findById(idTarefa);
        if (tarefaDB) {
            return transformarTarefa(tarefaDB)
        }

        return null;
    }
}

module.exports = TarefaRepository(MongoDBTarefaRepository);