import { formatarData } from "../utils/formatters.js";
import Conta from "../model/Conta.js";
import { FormatoData } from "../types/FormatoData.js";

const elementoDataAcesso = document.querySelector(".block-saldo time") as HTMLElement;
const elementoUsuario: HTMLElement = document.querySelector(".usuario");
const dataAcesso: Date = new Conta().getDataAcesso();

renderizarData();

function renderizarData() {
    if (elementoDataAcesso != null) {
        elementoDataAcesso.textContent = formatarData(dataAcesso, FormatoData.DIA_SEMANA_DIA_MES_ANO);
    }

    if (elementoUsuario != null) {
        const elementoDataUltimoAcesso: HTMLSpanElement = document.createElement("span");

        elementoDataUltimoAcesso.innerHTML = `<span>&nbsp;&nbsp;&nbsp;Último acesso: ${formatarData(new Conta().getDataUltimoAcesso(), FormatoData.DIA_MES_ANO_HORA_MINUTO_SEGUNDO)}</span>`;
        elementoUsuario.appendChild(elementoDataUltimoAcesso);
    }

    new Conta().registrarUltimoAcesso(dataAcesso);
}

const DataComponent = {
    atualiza() {
        renderizarData();
    }
}

export default DataComponent;