import Conta from "../model/Conta.js";
import { FormatoData } from "../types/FormatoData.js";
import { GrupoTransacao } from "../model/Transacao.js";
import { formatarData, formatarMoeda } from "../utils/formatters.js";

const elementoRegitroTransacoesExtrato: HTMLElement = document.querySelector(".extrato .registro-transacoes");

renderizarExtrato();

function renderizarExtrato(): void {
    const gruposTransacoes: GrupoTransacao[] = new Conta().getGruposTransacoes();
    elementoRegitroTransacoesExtrato.innerHTML = "";
    let htmlTransacoesGroup: string = "";

    for (let grupoTransacao of gruposTransacoes) {
        let htmlTransacaoItem: string = "";

        for (let transacao of grupoTransacao.transacoes) {
            htmlTransacaoItem += `
                <div class="transacao-item">
                    <div class="transacao-info">
                        <span class="tipo">${transacao.getTipoTransacao()}</span>
                        <strong class="valor">${formatarMoeda(transacao.getValor())}</strong>
                    </div>
                    <time class="data">${formatarData(transacao.getData(), FormatoData.DIA_MES)}</time>
                </div>
            `
        }

        htmlTransacoesGroup += `
        <div class="transacoes-group">
            <strong class="mes-group">${grupoTransacao.label}</strong>
            ${htmlTransacaoItem}
        </div>`;
    }

    if (htmlTransacoesGroup == "") {
        htmlTransacoesGroup = "<div>Não há transações registradas.</div>"
    }

    elementoRegitroTransacoesExtrato.innerHTML = htmlTransacoesGroup;
}

const ExtratoComponent = {
    atualizar(): void {
        renderizarExtrato();
    }
}

export default ExtratoComponent;