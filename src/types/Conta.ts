import { Transacao } from "./Transacao.js";
import { TipoTransacao } from "./TipoTransacao.js";
import { GrupoTransacao } from "./GrupoTransacao.js";
import { ResumoTransacoes } from "./ResumoTransacoes.js";

let saldo: number = JSON.parse(localStorage.getItem("saldo")) || 0;
const transacoes: Transacao[] = JSON.parse(localStorage.getItem("transacoes"), (key: string, value: string) => {
    if (key == "data") {
        return new Date(value);
    }

    return value;
}) || [];
const strDataUltimoAcesso: string = JSON.parse(localStorage.getItem("data-ultimo-acesso"));
const dataUltimoAcesso: Date = strDataUltimoAcesso ? new Date(strDataUltimoAcesso) : null;

function debitar(valor: number): void {
    if (valor <= 0) {
        throw Error("Valor debitado deve ser maior que zero!");
    }
    if (valor > saldo) {
        throw Error("Saldo insuficiente!");
    }
    saldo -= valor;
    localStorage.setItem("saldo", saldo.toString());
}

function depositar(valor: number): void {
    if (valor <= 0) {
        throw Error("Valor depositado deve ser maior que zero!");
    }
    saldo += valor;
    localStorage.setItem("saldo", saldo.toString());
}

const Conta = {
    getSaldo(): number {
        return saldo;
    },

    getDataAcesso(): Date {
        return new Date();
    },

    getDataUltimoAcesso(): Date {
        return dataUltimoAcesso ? dataUltimoAcesso : this.getDataAcesso();
    },

    getGruposTransacoes(): GrupoTransacao[] {
        const gruposTransacoes: GrupoTransacao[] = [];
        const listaTransacoes: Transacao[] = structuredClone(transacoes);
        const transacoesOrdenadas: Transacao[] = listaTransacoes.sort((t1, t2) => t2.data.getTime() - t1.data.getTime());
        let labelAtualGrupoTransacao: string = "";

        for (let transacao of transacoesOrdenadas) {
            let labelGrupoTransacao: string = transacao.data.toLocaleDateString("pt-br", { month: "long", year: "numeric" });
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

    getResumoTransacoes(): ResumoTransacoes {
        let resumoTransacoes: ResumoTransacoes = {
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

    registrarTransacao(novaTransacao: Transacao): void {
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

    registrarUltimoAcesso(data: Date): void {
        localStorage.setItem("data-ultimo-acesso", JSON.stringify(data));
    }
}

export default Conta;