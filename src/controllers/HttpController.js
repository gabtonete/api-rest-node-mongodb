const AppConstants = require('../enum/AppConstants')

class HttpController {
    // O baseController obriga os controllers a terem uma instância do express para que seja definida uma rota
    constructor(express) {
        if (!express) {
            throw new Error('A instância do express é obrigatória');
        }
        
        // tendo uma isntância do express, o base cria um método setupRoute e define qual a rota base (/api)
        this.express = express;
        this.setupRoutes(AppConstants.BASE_API_URL);
    }

    // Implementação obrigatória do setupRoutes nos controllers
    setupRoutes(baseUrl) {
        throw new Error('Método configurarRotas precisa ser implementado');
    }
}

module.exports = HttpController;