import { formatarMoeda } from "../utils/formatters.js";
import Conta from "../types/Conta.js";

let saldo: number = 3000;

const elementoSaldo = document.querySelector(".saldo-valor .valor") as HTMLInputElement;

renderizarSaldo();

function renderizarSaldo() {
    if (elementoSaldo != null ) {
        elementoSaldo.textContent = formatarMoeda(Conta.getSaldo());
    }
}

const SaldoComponent = {
    atualizar() {
        renderizarSaldo();
    }
}

export default SaldoComponent;