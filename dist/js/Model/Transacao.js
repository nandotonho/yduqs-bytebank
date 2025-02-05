export class Transacao {
    tipoTransacao;
    valor;
    data;
    titularOrigem;
    titularDestino;
    constructor(tipoTransacao, valor, data, titularOrigem, titularDestino) {
        this.tipoTransacao = tipoTransacao;
        this.valor = valor;
        this.data = data;
        this.titularOrigem = titularOrigem;
        this.titularDestino = titularDestino;
    }
    getTipoTransacao() {
        return this.tipoTransacao;
    }
    getValor() {
        return this.valor;
    }
    getData() {
        return this.data;
    }
    getTitularOrigem() {
        return this.titularOrigem;
    }
    getTitularDestino() {
        return this.titularDestino;
    }
    setTipoTransacao(tipoTransacao) {
        this.tipoTransacao = tipoTransacao;
    }
    setValor(valor) {
        this.valor = valor;
    }
    setData(data) {
        this.data = data;
    }
    setTitularOrigem(titularOrigem) {
        this.titularOrigem = titularOrigem;
    }
    setTitularDestino(titularDestino) {
        this.titularDestino = titularDestino;
    }
}
export var TipoTransacao;
(function (TipoTransacao) {
    TipoTransacao["DEPOSITO"] = "Dep\u00F3sito";
    TipoTransacao["TRANSFERENCIA"] = "Transfer\u00EAncia";
    TipoTransacao["PAGAMENTO_BOLETO"] = "Pagamento de Boleto";
})(TipoTransacao || (TipoTransacao = {}));
