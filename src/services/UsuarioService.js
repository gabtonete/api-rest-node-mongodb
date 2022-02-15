const UsuarioRepository = require('../repositories/impl/MongoDBUsuarioRepository');

class UsuarioService {

    async cadastrar(dadosUsuario) {
        // Uma array que armazena o erro referente a exceção, podendo ser exibido ao final se não tiver sucesso na lógica
        const listaErros = [];

        // Fitro do nome: Ele filtra o nome para saber se é válido de acordo com uma string normal
        if (!dadosUsuario.nome || !dadosUsuario.nome.trim()) {
            listaErros.push('Nome do usuário inválido');
        } else {
            const nomeParseado = parseInt(dadosUsuario.nome);
            const eUmNumero = !Number.isNaN(nomeParseado);

            if (eUmNumero) {
                listaErros.push('Nome do usuário inválido');
            }
        }

        // Filtro do email: Para filtrar a string do email, usamos o indexOf('@','.') !== -1, dessa forma sabemos se existe o valor um @ ou '.'
        if (!dadosUsuario.email || !dadosUsuario.email.trim()) {
            listaErros.push('Email do usuário inválido');
        } else {
            const temArrobaPonto = dadosUsuario.email.indexOf('@' && '.') !== -1;

            if (!temArrobaPonto) {
                listaErros.push('Email do usuário inválido');
            } else {

                // O filtro do email é feito através de um método .find() da collection do mongoose.
                // Para saber se o email já foi usado, criamos o método filtrar() no repository/interface
                // O método filtrar() terá o método .find() de acordo com a collection Usuário
                // Esse método é utilizado para buscar algum valor que seja idêntico ao passado no parâmetro, nesse caso, dadosUsuario.email, o "email" do body
                const usuarioComMesmoEmail = await UsuarioRepository.filtrar({
                    email: dadosUsuario.email
                });

                if (usuarioComMesmoEmail && usuarioComMesmoEmail.length) {
                    listaErros.push('Já existe um usuário com o mesmo email cadastrado!');
                }
            }
        }

        // O mesmo princípio do nome, filtra se é uma string válida sem espaços
        if (!dadosUsuario.senha || !dadosUsuario.senha.trim()) {
            listaErros.push('Senha do usuário inválido');
        }

        // Uma constante com um objeto de erros e dados do usuario para ser armazenado já ja em caso de erro ou sucesso
        const retorno = {
            erros: null,
            usuario: null
        }

        // Caso algum erro tenha sido guardado na listaErros, na const retorno será guardado essa lista, e a função cadastrar() devolverá esse retorno
        if (listaErros.length) {
            retorno.erros = listaErros

            // Caso não haja erro, na const usuarioCadastrado será guardado uma função .cadastrar() do UsuarioRepository
            // Essa função é responsável por criar no banco de dados os dados que foram passados, obedecendo os atributos obrigatórios
            // No caso do model Usuário, os três atributos aqui são obrigatórios
            // A função cadastrar do repository utiliza o método .create() do moongose (ou da collection Usuario), usando de parâmetros os dados que vieram do body
        } else {
            const usuarioCadastrado = await UsuarioRepository.cadastrar({
                nome: dadosUsuario.nome,
                email: dadosUsuario.email,
                senha: dadosUsuario.senha
            });

            // Como a const retorno era um objeto que podia armazenar erros ou sucesso, em caso de sucesso, no objeto 'usuario' guardaremos o usuarioCadastrado,
            // devolvendo assim uma função na variável retorno (somente no objeto usuario, o objeto erro está vazio)
            retorno.usuario = usuarioCadastrado;
        }

        // devolvendo assim uma função na variável retorno (somente no objeto usuario, o objeto erro está vazio)
        // esse retorno será usado no UsuarioController.js
        return retorno;
    }

}

module.exports = UsuarioService;