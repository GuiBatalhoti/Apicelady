export interface Bem {
    docId: string,
    numero: number; //único
    descricao: string;
    data_aquisicao: Date;
    valor_aquisicao: number;
    valor_presente: number;
    status: "ativo" | "baixado";
    condicao_uso: string;
    localizacao: historico[]; //histórico de localizações, a última é a atual; nome dos prédios
    responsavel: historico[]; //histórico de responsáveis, o último é o atual; sigla dos departamentos
    conferido?: historico[]; //histórico de conferências, a última é a atual; data da conferência
}

export interface historico {
    data: Date;
    atributo: string;
}