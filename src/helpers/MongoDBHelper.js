const mongoose = require('mongoose');

// Configuração geral do mongoose e sua conexão com o MongoDB Atlas
class MongoDBHelper {
    // A função connect do helper usa o método connect() do mongoose, passando como parâmetro a connectionstring e as options
    static connect() {
        const conexao = mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
           useNewUrlParser: true,
           useUnifiedTopology: true
        });

        mongoose.connection.on('connected', () => console.log('Conectado ao mongoDB'));

        mongoose.connection.on('error', e => console.error('Erro ao conectar o mongoDB', e.message));        
        
        return conexao;
    }
}

module.exports = MongoDBHelper;