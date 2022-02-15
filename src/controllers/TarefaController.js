const HttpController = require("./HttpController");
const TarefaService = require("../services/TarefaService");

class TarefaController extends HttpController {
    setupRoutes(baseUrl) {
        this.express.get(`${baseUrl}/tarefa`, this.listar.bind(this));
        this.express.post(`${baseUrl}/tarefa`, this.cadastrar.bind(this));
        this.express.put(`${baseUrl}/tarefa/:id`, this.editar.bind(this));
        this.express.delete(`${baseUrl}/tarefa/:id`, this.deletar.bind(this));
    }

    async listar(req, res) {
        try {
            const servico = new TarefaService(req.usuario.id);
            const tarefas = await servico.listar(req.query);
            res.json(tarefas);

        } catch (e) {
            req.logger.error("Erro ao processar requisição de listar tarefas", "erro="+ e.message)
            res.status(500).json({
                status: 500,
                erro: "Não foi possível listar as tarefas"
            });
        }
    }

    async cadastrar(req, res) {
        try {
            const servico = new TarefaService(req.usuario.id);
            const resultado = await servico.cadastrar(req.body);
            
            if(resultado.erros) {
                return res.status(400).json({
                    status: 400,
                    erro: resultado.erros
                });
            }

            return res.json({
                msg: "Tarefa cadastrada com sucesso!"
            });

        } catch (e) {
            req.logger.error("Erro ao processar requisição de cadastro", "erro="+ e.message)
            res.status(500).json({
                status: 500,
                erro: "Não foi possível cadastrar a tarefa"
            });
        }
    }

    async editar(req, res) {
        try {
            const servico = new TarefaService(req.usuario.id);
            const resultado = await servico.editar(req.params.id, req.body);
            if (resultado.erros) {
                return res.status(400).json({
                    status: 400,
                    erro: resultado.erros
                });
            }

            res.json({
                msg: "Tarefa atualizada com sucesso"
            })
    
        } catch (e) {
            req.logger.error("Erro ao processar requisição de edição", "erro="+ e.message)
            res.status(500).json({
                status: 500,
                erro: "Não foi possível editar a tarefa"
            }); 
        }
    }

    async deletar(req, res) {
        try {
            const servico = new TarefaService(req.usuario.id);
            const resultado = await servico.deletar(req.params.id);
            if (resultado.erros) {
                return res.status(400).json({
                    status: 400,
                    erro: resultado.erros
                });
            }

            res.json({
                msg: "Tarefa deletada com sucesso"
            })
        } catch (e) {
            req.logger.error("Erro ao processar requisição de deleção", "erro="+ e.message)
            res.status(500).json({
                status: 500,
                erro: "Não foi possível deletar a tarefa"
            });
        }
    }
}

module.exports = TarefaController;