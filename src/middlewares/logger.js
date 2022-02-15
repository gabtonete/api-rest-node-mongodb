module.exports = (req, res, next) => {

    // O traceId é um valor aleatório para uma chamada no logger, colocamos para ter como parâmetro qual é a exceção ou para registro
    const traceId = Math.ceil(Math.random() * 99999999999);

    // A regra de negócio do logger
    const logger = {
        error: (mensagem, ...parametrosExtras) => {
            console.error(`[ERROR] traceId=${traceId}, msg=${mensagem}`, ...parametrosExtras);
        },
        debug: (mensagem, ...parametrosExtras) => {
            console.log(`[DEBUG] traceId=${traceId}, msg=${mensagem}`, ...parametrosExtras);
        },
        info: (mensagem, ...parametrosExtras) => {
            console.info(`[INFO] traceId=${traceId}, msg=${mensagem}`, ...parametrosExtras);
        }
    }

    logger.info(`requisicao recebida`, `url=${req.url}`, `metodo_http=${req.method}`);

    // O parâmetro any que faz com o que o logger possa ser chamado nos programas em qualquer lugar
    req.logger = logger;

    next();
}