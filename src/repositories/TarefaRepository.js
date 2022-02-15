module.exports = (type) => {
    if(!type.cadastrar) {
        throw new Error(`A classe ${type} não implementou o método cadastrar`)
    }

    if(!type.editar) {
        throw new Error(`A classe ${type} não implementou o método editar`)
    }

    if(!type.deletar) {
        throw new Error(`A classe ${type} não implementou o método deletar`)
    }

    if(!type.filtrar) {
        throw new Error(`A classe ${type} não implementou o método filtrar`)
    }

    if(!type.buscarPorId) {
        throw new Error(`A classe ${type} não implementou o método buscarPorId`)
    }

    return type;
}
