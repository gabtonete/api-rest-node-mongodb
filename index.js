// Biblioteca responsável pelo ambiente secreto do programa
require('dotenv').config();

// Arquivo responsável por todos os métodos primitivos que dão início ao programa
const App = require('./src/App.js');

// Início do programa através do método .start() do objeto app da classe App;
const app = new App();
app.start();