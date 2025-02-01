import { TipoTransacao } from "./TipoTransacao.js";
let saldo = JSON.parse(localStorage.getItem("saldo")) || 0;
const transacoes = JSON.parse(localStorage.getItem("transacoes"), (key, value) => {
    if (key == "data") {
        return new Date(value);
    }
    return value;
}) || [];
const strDataUltimoAcesso = JSON.parse(localStorage.getItem("data-ultimo-acesso"));
const dataUltimoAcesso = strDataUltimoAcesso ? new Date(strDataUltimoAcesso) : null;
function debitar(valor) {
    if (valor <= 0) {
        throw Error("Valor debitado deve ser maior que zero!");
    }
    if (valor > saldo) {
        throw Error("Saldo insuficiente!");
    }
    saldo -= valor;
    localStorage.setItem("saldo", saldo.toString());
}
function depositar(valor) {
    if (valor <= 0) {
        throw Error("Valor depositado deve ser maior que zero!");
    }
    saldo += valor;
    localStorage.setItem("saldo", saldo.toString());
}
const Conta = {
    getSaldo() {
        return saldo;
    },
    getDataAcesso() {
        return new Date();
    },
    getDataUltimoAcesso() {
        return dataUltimoAcesso ? dataUltimoAcesso : this.getDataAcesso();
    },
    getGruposTransacoes() {
        const gruposTransacoes = [];
        const listaTransacoes = structuredClone(transacoes);
        const transacoesOrdenadas = listaTransacoes.sort((t1, t2) => t2.data.getTime() - t1.data.getTime());
        let labelAtualGrupoTransacao = "";
        for (let transacao of transacoesOrdenadas) {
            let labelGrupoTransacao = transacao.data.toLocaleDateString("pt-br", { month: "long", year: "numeric" });
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
    },
    getResumoTransacoes() {
        let resumoTransacoes = {
            totalDepositos: 0,
            totalPagamentosBoleto: 0,
            totalTransferencias: 0
        };
        resumoTransacoes.totalDepositos = transacoes.filter(transacao => transacao.tipoTransacao == TipoTransacao.DEPOSITO)
            .reduce((acc, transacao) => acc + transacao.valor, 0);
        resumoTransacoes.totalPagamentosBoleto = transacoes.filter(transacao => transacao.tipoTransacao == TipoTransacao.PAGAMENTO_BOLETO)
            .reduce((acc, transacao) => acc + transacao.valor, 0);
        resumoTransacoes.totalTransferencias = transacoes.filter(transacao => transacao.tipoTransacao == TipoTransacao.TRANSFERENCIA)
            .reduce((acc, transacao) => acc + transacao.valor, 0);
        return resumoTransacoes;
    },
    registrarTransacao(novaTransacao) {
        if (novaTransacao.tipoTransacao == TipoTransacao.DEPOSITO) {
            depositar(novaTransacao.valor);
        }
        else if (novaTransacao.tipoTransacao == TipoTransacao.TRANSFERENCIA || novaTransacao.tipoTransacao == TipoTransacao.PAGAMENTO_BOLETO) {
            debitar(novaTransacao.valor);
            novaTransacao.valor *= -1;
        }
        else {
            throw Error("Tipo de Transação é inválido!");
        }
        transacoes.push(novaTransacao);
        localStorage.setItem("transacoes", JSON.stringify(transacoes));
        console.log(this.getGruposTransacoes());
    },
    registrarUltimoAcesso(data) {
        localStorage.setItem("data-ultimo-acesso", JSON.stringify(data));
    }
};
export default Conta;
