import { Transacao } from "./Transacao.js";
import { TipoTransacao } from "./Transacao.js";
class Conta {
    titular;
    dataAbertura;
    dataEncerramento;
    saldo = JSON.parse(localStorage.getItem("saldo")) || 0;
    limite;
    dataUltimoAcesso = JSON.parse(localStorage.getItem("data-ultimo-acesso"))
        ? new Date(JSON.parse(localStorage.getItem("data-ultimo-acesso")))
        : null;
    transacoes = [];
    constructor() {
        this.loadTransacoes();
    }
    getTitular() {
        return this.titular;
    }
    getDataAbertura() {
        return this.dataAbertura;
    }
    getDataEncerramento() {
        return this.dataEncerramento;
    }
    getSaldo() {
        return this.saldo;
    }
    getLimite() {
        return this.limite;
    }
    getDataUltimoAcesso() {
        return this.dataUltimoAcesso ? this.dataUltimoAcesso : this.getDataAcesso();
    }
    getTransacoes() {
        return this.transacoes;
    }
    setTitular(titular) {
        this.titular = titular;
    }
    setDataAbertura(dataAbertura) {
        this.dataAbertura = dataAbertura;
    }
    setDataEncerramento(dataEncerramento) {
        this.dataEncerramento = dataEncerramento;
    }
    setSaldo(saldo) {
        this.saldo = saldo;
    }
    setLimite(limite) {
        this.limite = limite;
    }
    setTransacoes(transacoes) {
        this.transacoes = transacoes;
    }
    getDataAcesso() {
        return new Date();
    }
    debitar(valor) {
        if (valor <= 0) {
            throw Error("Valor debitado deve ser maior que zero!");
        }
        if (valor > this.saldo) {
            throw Error("Saldo insuficiente!");
        }
        this.saldo -= valor;
        localStorage.setItem("saldo", this.saldo.toString());
    }
    depositar(valor) {
        if (valor <= 0) {
            throw Error("Valor depositado deve ser maior que zero!");
        }
        this.saldo += valor;
        localStorage.setItem("saldo", this.saldo.toString());
    }
    registrarTransacao(novaTransacao) {
        if (novaTransacao.getTipoTransacao() == TipoTransacao.DEPOSITO) {
            this.depositar(novaTransacao.getValor());
        }
        else if (novaTransacao.getTipoTransacao() == TipoTransacao.TRANSFERENCIA || novaTransacao.getTipoTransacao() == TipoTransacao.PAGAMENTO_BOLETO) {
            this.debitar(novaTransacao.getValor());
            novaTransacao.setValor(novaTransacao.getValor() * -1);
        }
        else {
            throw Error("Tipo de Transação é inválido!");
        }
        this.transacoes.push(novaTransacao);
        localStorage.setItem("transacoes", JSON.stringify(this.transacoes));
    }
    getGruposTransacoes() {
        const gruposTransacoes = [];
        const listaTransacoes = [];
        let transacaoAtual;
        for (let transacao of this.transacoes) {
            transacaoAtual = new Transacao(transacao.getTipoTransacao(), transacao.getValor(), transacao.getData());
            listaTransacoes.push(transacao);
        }
        const transacoesOrdenadas = listaTransacoes.sort((t1, t2) => t2.getData().getTime() - t1.getData().getTime());
        let labelAtualGrupoTransacao = "";
        for (let transacao of transacoesOrdenadas) {
            let labelGrupoTransacao = transacao.getData().toLocaleDateString("pt-br", { month: "long", year: "numeric" });
            if (labelAtualGrupoTransacao != labelGrupoTransacao) {
                labelAtualGrupoTransacao = labelGrupoTransacao;
                gruposTransacoes.push({
                    label: labelGrupoTransacao,
                    transacoes: []
                });
            }
            gruposTransacoes.at(-1).transacoes.push(transacao);
        }
        return gruposTransacoes;
    }
    registrarUltimoAcesso(data) {
        localStorage.setItem("data-ultimo-acesso", JSON.stringify(data));
    }
    getResumoTransacoes() {
        let resumoTransacoes = {
            totalDepositos: 0,
            totalPagamentosBoleto: 0,
            totalTransferencias: 0
        };
        resumoTransacoes.totalDepositos = this.transacoes.filter(transacao => transacao.getTipoTransacao() == TipoTransacao.DEPOSITO)
            .reduce((acc, transacao) => acc + transacao.getValor(), 0);
        resumoTransacoes.totalPagamentosBoleto = this.transacoes.filter(transacao => transacao.getTipoTransacao() == TipoTransacao.PAGAMENTO_BOLETO)
            .reduce((acc, transacao) => acc + transacao.getValor(), 0);
        resumoTransacoes.totalTransferencias = this.transacoes.filter(transacao => transacao.getTipoTransacao() == TipoTransacao.TRANSFERENCIA)
            .reduce((acc, transacao) => acc + transacao.getValor(), 0);
        return resumoTransacoes;
    }
    loadTransacoes() {
        this.transacoes = [];
        const transacoesArmazenadas = JSON.parse(localStorage.getItem("transacoes"), (key, value) => {
            if (key == "data") {
                return new Date(value);
            }
            return value;
        }) || [];
        let transacao;
        for (let transacaoArmazenada of transacoesArmazenadas) {
            transacao = new Transacao(transacaoArmazenada.tipoTransacao, transacaoArmazenada.valor, transacaoArmazenada.data);
            this.transacoes.push(transacao);
        }
    }
}
export default Conta;
