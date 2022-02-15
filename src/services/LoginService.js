const jwt = require('jsonwebtoken');
const md5 = require('md5');
const UsuarioRepository = require('../repositories/impl/MongoDBUsuarioRepository');

class LoginService {
    // Essa função receberá login e senha oriundos do Body
    async logar(login, senha) {

        // O login será guardado no objeto email, e a senha será transformada em hash md5 e reescrita
        const filtro = {
            email: login,
            senha : md5(senha)
        }

        // uma variável para se guardado já já
        let usuario = null;

        // Na const usuarios, usaremos o método filtrar() do repository, passando como parâmetro a const filtro
        // O método filtrar() do repository possui o método find() do Mongoose, e irá buscar no banco de dados qual a tabela possui
        // o mesmo email e a mesma senha da const filtro (precisará validar os dois campos)
        const usuarios = await UsuarioRepository.filtrar(filtro);

        // Se esse valor existir, o repository irá nos devolver o campo INTEIRO do MongoDB relativo ao usuário que passamos o email e senha
        // No mongoDB, o campo "_doc" possui um _id, o nome de cadastro e o email de cadastro, e escolheremos por devolver esses valores
        // Esses valores serão guardado na variável usuario
        if (usuarios && usuarios.length) {
            usuario = usuarios[0];
        } else {
            // Caso não haja nada a ser encontrado no banco, o retorno é nulo, resultando numa falha de login no Controller
            return null;
        }

        // O método .sign do jwt criará um token com base na id do usuário e na chave secreta definida no .env 
        const token = jwt.sign({ _id: usuario.id }, process.env.SECRET_JWT);

        // retorna o objeto usuario e os dados requisitados no if, e também o token de acesso com base na id desse mesmo usuário + chave secreta
        return {
            ...usuario,
            token
        }
    }
}

module.exports = LoginService;