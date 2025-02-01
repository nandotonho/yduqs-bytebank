import Conta from "../types/Conta.js";
import { FormatoData } from "../types/FormatoData.js";
import { formatarData, formatarMoeda } from "../utils/formatters.js";
const elementoRegitroTransacoesExtrato = document.querySelector(".extrato .registro-transacoes");
renderizarExtrato();
console.log(Conta.getResumoTransacoes());
function renderizarExtrato() {
    const gruposTransacoes = Conta.getGruposTransacoes();
    elementoRegitroTransacoesExtrato.innerHTML = "";
    let htmlTransacoesGroup = "";
    for (let grupoTransacao of gruposTransacoes) {
        let htmlTransacaoItem = "";
        for (let transacao of grupoTransacao.transacoes) { //perguntar
            htmlTransacaoItem += `
                <div class="transacao-item">
                    <div class="transacao-info">
                        <span class="tipo">${transacao.tipoTransacao}</span>
                        <strong class="valor">${formatarMoeda(transacao.valor)}</strong>
                    </div>
                    <time class="data">${formatarData(transacao.data, FormatoData.DIA_MES)}</time>
                </div>
            `;
        }
        htmlTransacoesGroup += `
        <div class="transacoes-group">
            <strong class="mes-group">${grupoTransacao.label}</strong>
            ${htmlTransacaoItem}
        </div>`;
    }
    if (htmlTransacoesGroup == "") {
        htmlTransacoesGroup = "<div>Não há transações registradas.</div>";
    }
    elementoRegitroTransacoesExtrato.innerHTML = htmlTransacoesGroup;
}
const ExtratoComponent = {
    atualizar() {
        renderizarExtrato();
    }
};
export default ExtratoComponent;
