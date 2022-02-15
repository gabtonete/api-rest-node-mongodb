const mongoose = require('mongoose');
const Schema = mongoose.Schema; // Usamos essa classe para que o mongoose configure uma collection automaticamente

const md5 = require('md5');

const mensagemErroObrigatorio = '*Campo obrigatório!';

const UsuarioSchema = new Schema({ // O schema recebe o objeto com seus atributos em forma de json
    nome: {
        type: String,  // O tipo do dado do atributo que irá para a collection
        required: [true, mensagemErroObrigatorio]  //  Define um atributo como obrigatório, caso não seja preenchido, mostrará esse Erro
    },
    email: {
        type: String,
        required: [true, mensagemErroObrigatorio]
    },
    senha: {
        type: String,
        required: [true, mensagemErroObrigatorio]
    }
});

UsuarioSchema.pre('save', function (next) { // Essa função é executada ANTES (pre) do usuário ser salvo
    this.senha = md5(this.senha);     // Salva a senha usando o algoritmo md5
    next();
});

const Usuario = mongoose.model('usuarios', UsuarioSchema); 
// o método .model() do mongoose salva a collection 'usuarios', usando o modelo UsuarioSchema no MongoDB Atlas
// Esse método foi salvo numa const para ela ser exportada no repository, onde será usado para acessar a collection e fazer métodos CRUD
module.exports = Usuario;