import { Bem } from "./DataStructures/Bem";

export interface DataTableProps {
    data: string[];
    getRowColor: (item: string) => string;
  }