export interface HomeItemProps {
    sala: string;
    tipo: string;
    dataRealizacao: string;
    docId: string;
    onItemPress: (item: { sala: string; tipo: string; dataRealizacao: string, docId: string }) => void;
}