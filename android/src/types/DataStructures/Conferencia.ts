import { Bem } from "./Bem";
import { Sala } from "./Sala";

export interface Conferencia {
    docId: string;
    dataSolicitacao: Date;
    dataRealizacao: Date;
    tipo: "ordinaria" | "extraordinaria";
    local: Sala;
    bensRegistrados: Bem[];
    finalizada: "SIM" | "NÃO" | "EM ANDAMENTO";
}
