export interface HomeItemProps {
    sala: string;
    tipo: string;
    dataRealizacao: string;
    onItemPress: (item: { sala: string; tipo: string; dataRealizacao: string }) => void;
}