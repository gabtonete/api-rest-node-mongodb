module.exports = (type) => {
    if(!type.buscarUsuario){
        throw new Error(`
        A classe ${type} não implementou o método buscarUsuario`)
    }
    if(!type.deletarPorIdESenha) {
        throw new Error(`A classe ${type} não implementou o método deletarPorId`)
    }

    return type;
}
