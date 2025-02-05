export class Transacao {
    private tipoTransacao: TipoTransacao;

    private valor: number;

    private data: Date;

    private titularOrigem: string;

    private titularDestino: string;

    public constructor ();
    public constructor (tipoTransacao: TipoTransacao, valor: number, data: Date);
    
    public constructor (tipoTransacao?: TipoTransacao, valor?: number, data?: Date, titularOrigem?: string, titularDestino?: string) {
        this.tipoTransacao = tipoTransacao;
        this.valor = valor;
        this.data = data;
        this.titularOrigem = titularOrigem;
        this.titularDestino = titularDestino;
    }
    
    public getTipoTransacao(): TipoTransacao {
        return this.tipoTransacao;
    }

    public getValor(): number {
        return this.valor;
    }

    public getData(): Date {
        return this.data;
    }

    public getTitularOrigem(): string {
        return this.titularOrigem;
    }

    public getTitularDestino(): string {
        return this.titularDestino;
    }

    public setTipoTransacao(tipoTransacao: TipoTransacao) {
        this.tipoTransacao = tipoTransacao;
    }

    public setValor(valor: number) {
        this.valor = valor;
    }

    public setData(data: Date) {
        this.data = data;
    }

    public setTitularOrigem(titularOrigem: string) {
        this.titularOrigem = titularOrigem;
    }

    public setTitularDestino(titularDestino: string) {
        this.titularDestino = titularDestino;
    }
}

export enum TipoTransacao {
    DEPOSITO = "Depósito",
    TRANSFERENCIA = "Transferência",
    PAGAMENTO_BOLETO = "Pagamento de Boleto"
}

export type GrupoTransacao = {
    label: string,
    transacoes: Transacao[]
}

export type ResumoTransacoes = {
    totalDepositos: number;
    totalTransferencias: number;
    totalPagamentosBoleto: number;
}

export type AtributoTransacao = {
    tipoTransacao: TipoTransacao;
    valor: number;
    data: Date;
}