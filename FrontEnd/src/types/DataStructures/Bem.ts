export interface Bem {
    docId: string,
    numero: number; //único
    descricao: string;
    data_aquisicao: string;
    valor_aquisicao: number;
    valor_presente: number;
    status: string;
    condicao_uso: string;
    localizacao: [string]; //histórico de localizações, a última é a atual; nome dos prédios
    responsavel: [string]; //histórico de responsáveis, o último é o atual; sigla dos departamentos
}