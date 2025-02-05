import { Armazenador } from "../utils/Armazenador.js";
import { Transacao } from "./Transacao.js";
import { TipoTransacao } from "./Transacao.js";
import { GrupoTransacao } from "./Transacao.js";
import { ResumoTransacoes } from "./Transacao.js";

class Conta {
    private titular: string;

    private dataAbertura: Date;

    private dataEncerramento: Date;

    private saldo: number = Armazenador.obter("saldo") || 0;

    private limite: number;

    private dataUltimoAcesso: Date
        = Armazenador.obter(("data-ultimo-acesso"))
        ? new Date(Armazenador.obter(("data-ultimo-acesso")))
        : null;

    private transacoes: Transacao[] = [];

    constructor () {
        this.loadTransacoes();
    }

    public getTitular(): string {
        return this.titular;
    }

    public getDataAbertura(): Date {
        return this.dataAbertura;
    }

    public getDataEncerramento(): Date {
        return this.dataEncerramento;
    }

    public getSaldo(): number {
        return this.saldo;
    }

    public getLimite(): number {
        return this.limite;
    }

    public getDataUltimoAcesso(): Date {
        return this.dataUltimoAcesso ? this.dataUltimoAcesso : this.getDataAcesso();
    }

    public getTransacoes(): Transacao[] {
        return this.transacoes;
    }

    public setTitular(titular: string) {
        this.titular = titular;
    }

    public setDataAbertura(dataAbertura: Date) {
        this.dataAbertura = dataAbertura;
    }

    public setDataEncerramento(dataEncerramento: Date) {
        this.dataEncerramento = dataEncerramento;
    }

    public setSaldo(saldo: number) {
        this.saldo = saldo;
    }

    public setLimite(limite: number) {
        this.limite = limite;
    }

    public setTransacoes(transacoes: Transacao[]) {
        this.transacoes = transacoes;
    }

    public getDataAcesso(): Date {
        return new Date();
    }

    private debitar(valor: number): void {
        if (valor <= 0) {
            throw Error("Valor debitado deve ser maior que zero!");
        }
        if (valor > this.saldo) {
            throw Error("Saldo insuficiente!");
        }
        this.saldo -= valor;
        Armazenador.salvar("saldo", this.saldo);
    }

    private depositar(valor: number): void {
        if (valor <= 0) {
            throw Error("Valor depositado deve ser maior que zero!");
        }
        this.saldo += valor;
        Armazenador.salvar("saldo", this.saldo);
    }

    public registrarTransacao(novaTransacao: Transacao): void {
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
        Armazenador.salvar("transacoes", this.transacoes);
    }

    public getGruposTransacoes(): GrupoTransacao[] {
        const gruposTransacoes: GrupoTransacao[] = [];

        const listaTransacoes: Transacao[] = [];
        let transacaoAtual: Transacao;
        for (let transacao of this.transacoes) {
            transacaoAtual = new Transacao(transacao.getTipoTransacao(), transacao.getValor(), transacao.getData());
            listaTransacoes.push(transacaoAtual);
        }

        const transacoesOrdenadas: Transacao[] = listaTransacoes.sort((t1, t2) => t2.getData().getTime() - t1.getData().getTime());
        let labelAtualGrupoTransacao: string = "";

        for (let transacao of transacoesOrdenadas) {
            let labelGrupoTransacao: string = transacao.getData().toLocaleDateString("pt-br", { month: "long", year: "numeric" });
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

    public registrarUltimoAcesso(data: Date): void {
        localStorage.setItem("data-ultimo-acesso", JSON.stringify(data));
    }

    public getResumoTransacoes(): ResumoTransacoes {
        let resumoTransacoes: ResumoTransacoes = {
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

    private loadTransacoes() {
        this.transacoes = [];

        const transacoesArmazenadas = Armazenador.obter(("transacoes"), (key: string, value: string) => {
            if (key == "data") {
                return new Date(value);
            }

            return value;
        }) || [];

        let transacao: Transacao;

        for (let transacaoArmazenada of transacoesArmazenadas) {
            transacao = new Transacao(transacaoArmazenada.tipoTransacao, transacaoArmazenada.valor, transacaoArmazenada.data);
            this.transacoes.push(transacao);
        }
    }
}

export default Conta;