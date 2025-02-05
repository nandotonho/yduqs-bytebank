import { formatarMoeda } from "../utils/formatters.js";
import Conta from "../model/Conta.js";

let saldo: number = 3000;

const elementoSaldo = document.querySelector(".saldo-valor .valor") as HTMLInputElement;

renderizarSaldo();

function renderizarSaldo() {
    if (elementoSaldo != null ) {
        elementoSaldo.textContent = formatarMoeda(new Conta().getSaldo());
    }

    console.log(new Conta().getResumoTransacoes());
}

const SaldoComponent = {
    atualizar() {
        renderizarSaldo();
    }
}

export default SaldoComponent;