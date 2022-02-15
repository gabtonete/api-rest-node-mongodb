module.exports = (type) => {
    if(!type.cadastrar) {
        throw new Error(`A classe ${type} não implementou o método cadastrar`)
    }

    if(!type.filtrar) {
        throw new Error(`A classe ${type} não implementou o método filtrar`)
    }
    
    if (!type.buscarPorId) {
        throw new Error(`A classe ${type} não implementou o método buscarPorId`)
    }
    return type;
}

/* 
Interface necessária para definir quais métodos as implementações precisam obrigatoriamente ter. Caso não implementem
será exibido o erro (impl)

O parâmetro 'type' faz referência a qual impl está usando essa interface (repository)
 */