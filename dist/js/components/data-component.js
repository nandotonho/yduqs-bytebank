import { formatarData } from "../utils/formatters.js";
import Conta from "../model/Conta.js";
import { FormatoData } from "../types/FormatoData.js";
const elementoDataAcesso = document.querySelector(".block-saldo time");
const elementoUsuario = document.querySelector(".usuario");
const dataAcesso = new Conta().getDataAcesso();
renderizarData();
function renderizarData() {
    if (elementoDataAcesso != null) {
        elementoDataAcesso.textContent = formatarData(dataAcesso, FormatoData.DIA_SEMANA_DIA_MES_ANO);
    }
    if (elementoUsuario != null) {
        const elementoDataUltimoAcesso = document.createElement("span");
        elementoDataUltimoAcesso.innerHTML = `<span>&nbsp;&nbsp;&nbsp;Último acesso: ${formatarData(new Conta().getDataUltimoAcesso(), FormatoData.DIA_MES_ANO_HORA_MINUTO_SEGUNDO)}</span>`;
        elementoUsuario.appendChild(elementoDataUltimoAcesso);
    }
    new Conta().registrarUltimoAcesso(dataAcesso);
}
const DataComponent = {
    atualiza() {
        renderizarData();
    }
};
export default DataComponent;
