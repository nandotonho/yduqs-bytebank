import { formatarTransacao } from "../utils/formatters.js";
import { FormatoData } from "../types/FormatoData.js";
import SaldoComponent from "./saldo-component.js";
import Conta from "../types/Conta.js";
import ExtratoComponent from "./extrato-component.js";
const elementoFormulario = document.querySelector(".block-nova-transacao form");
elementoFormulario.addEventListener("submit", function (event) {
    try {
        event.preventDefault();
        if (!elementoFormulario.checkValidity()) {
            alert("Por favor, preencha todos os campos da transação!");
            return;
        }
        const inputTipoTransacao = document.querySelector("#tipoTransacao");
        const inputValor = document.querySelector("#valor");
        const inputData = document.querySelector("#data");
        let tipoTransacao = inputTipoTransacao.value;
        let valor = inputValor.valueAsNumber;
        let data = new Date(inputData.value + " 00:00:00");
        const novaTransacao = {
            tipoTransacao: tipoTransacao,
            valor: valor,
            data: data
        };
        Conta.registrarTransacao(novaTransacao);
        SaldoComponent.atualizar();
        ExtratoComponent.atualizar();
        console.log(formatarTransacao(novaTransacao.valor, novaTransacao.data, FormatoData.DIA_SEMANA_DIA_MES_ANO));
        console.log(formatarTransacao(novaTransacao.valor, novaTransacao.data, FormatoData.PADRAO));
        elementoFormulario.reset();
    }
    catch (erro) {
        alert(erro.message);
    }
});
