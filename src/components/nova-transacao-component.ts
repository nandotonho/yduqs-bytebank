import { formatarTransacao } from "../utils/formatters.js";
import { FormatoData } from "../types/FormatoData.js";
import { TipoTransacao } from "../model/Transacao.js";
import { Transacao } from "../model/Transacao.js";
import SaldoComponent from "./saldo-component.js";
import Conta from "../model/Conta.js";
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
    
        const novaTransacao: Transacao = new Transacao(tipoTransacao, valor, data);
    
        new Conta().registrarTransacao(novaTransacao);
        SaldoComponent.atualizar();
        ExtratoComponent.atualizar();
        elementoFormulario.reset();
    }
    catch(erro) {
        alert(erro.message);
    }
})