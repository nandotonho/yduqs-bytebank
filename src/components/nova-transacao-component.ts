import { formatarTransacao } from "../utils/formatters.js";
import { FormatoData } from "../types/FormatoData.js";
import { TipoTransacao } from "../types/TipoTransacao.js";
import { Transacao } from "../types/Transacao.js";
import SaldoComponent from "./saldo-component.js";
import Conta from "../types/Conta.js";
import ExtratoComponent from "./extrato-component.js";

const elementoFormulario = document.querySelector(".block-nova-transacao form") as HTMLFormElement;

elementoFormulario.addEventListener("submit", function(event) {
    try {
        event.preventDefault();
        if (!elementoFormulario.checkValidity()) {
            alert("Por favor, preencha todos os campos da transação!");
            return;
        }
    
        const inputTipoTransacao = document.querySelector("#tipoTransacao") as HTMLSelectElement;
        const inputValor = document.querySelector("#valor") as HTMLInputElement;
        const inputData = document.querySelector("#data") as HTMLInputElement;
    
        let tipoTransacao: TipoTransacao = inputTipoTransacao.value as TipoTransacao;
        let valor: number = inputValor.valueAsNumber;
        let data: Date = new Date(inputData.value + " 00:00:00");
    
        const novaTransacao: Transacao = {
            tipoTransacao: tipoTransacao,
            valor: valor,
            data: data
        }
    
        Conta.registrarTransacao(novaTransacao);
        SaldoComponent.atualizar();
        ExtratoComponent.atualizar();
        console.log(formatarTransacao(novaTransacao.valor, novaTransacao.data, FormatoData.DIA_SEMANA_DIA_MES_ANO));
        console.log(formatarTransacao(novaTransacao.valor, novaTransacao.data, FormatoData.PADRAO));
        elementoFormulario.reset();
    }
    catch(erro) {
        alert(erro.message);
    }
})