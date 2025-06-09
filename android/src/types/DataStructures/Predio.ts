export interface Predio {
    docId: string,
    nome: string; //único
    descricao: string;
    endereco: string;
    numero: number;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    capacidade: number;
    area: number;
    latitude: number;
    longitude: number;
}