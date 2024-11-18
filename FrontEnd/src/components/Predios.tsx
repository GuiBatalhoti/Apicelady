import GenericTable from "./GenericTable";
import { Column } from "../types/GenericTableProps";
import { Predio } from "../types/DataStructures/Predio";
import { getPredios } from "../config/firebase";
import { useEffect, useState } from "react";
import { DocumentData } from "firebase/firestore";
import { Button, Typography } from "@mui/material";
import ApartmentIcon from '@mui/icons-material/Apartment';
import "../styles/Predios.css";

export default function Predios() {

    const [predios, setPredios] = useState<Predio[]>([]);

    const columns = [
        { label: 'Nome', dataKey: 'nome', numeric: false, width: 100 },
        { label: 'Descrição', dataKey: 'descricao', numeric: false, width: 300 },
        { label: 'Endereço', dataKey: 'endereco', numeric: false, width: 150 },
        { label: 'Número', dataKey: 'numero', numeric: true, width: 50 },
        { label: 'Bairro', dataKey: 'bairro', numeric: false, width: 100 },
        { label: 'Cidade', dataKey: 'cidade', numeric: false, width: 100 },
        { label: 'Estado', dataKey: 'estado', numeric: false, width: 100 },
        { label: 'CEP', dataKey: 'cep', numeric: false, width: 100 },
        { label: 'Complemento', dataKey: 'complemento', numeric: false, width: 100 },
        { label: 'Latitude', dataKey: 'latitude', numeric: true, width: 100 },
        { label: 'Longitude', dataKey: 'longitude', numeric: true, width: 100 },
        { label: 'Capacidade', dataKey: 'capacidade', numeric: true, width: 100 },
        { label: 'Área', dataKey: 'area', numeric: true, width: 100 }
    ] as Column<Predio>[];

    const handleOnAdicionarPredio = () => {
        console.log("Adicionar prédio");
    }

    const handleOnEditarPredio = (predio: Predio) => {
        alert(`Editar prédio ${JSON.stringify(predio)}`);
    }

    const handleOnExcluirPredio = (predio: Predio) => {
        console.log("Excluir prédio", predio);
    }

    useEffect(() => {
        getPredios().then((data: DocumentData[]) => {
            const predios: Predio[] = data.map(doc => ({
                nome: doc.nome,
                descricao: doc.descricao,
                endereco: doc.endereco,
                numero: doc.numero,
                bairro: doc.bairro,
                cidade: doc.cidade,
                estado: doc.estado,
                cep: doc.cep,
                complemento: doc.complemento,
                latitude: doc.latitude,
                longitude: doc.longitude,
                capacidade: doc.capacidade,
                area: doc.area
            }));
            setPredios(predios);
        });
    }, []);
    
    return (
        <div>
            <div className="header">
                <Typography variant="h4" className="nome-pagina"> 
                    <ApartmentIcon className="icon" /> 
                    Prédios
                </Typography>
                <Button variant="contained" className="button" onClick={handleOnAdicionarPredio}>Adicionar prédio</Button>
            </div>
            <GenericTable columns={columns} data={predios} onEdit={handleOnEditarPredio} onDelete={handleOnExcluirPredio} />
        </div>
    );
}
