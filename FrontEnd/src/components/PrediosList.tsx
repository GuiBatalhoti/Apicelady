import { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import ApartmentIcon from "@mui/icons-material/Apartment";
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import GenericTable from "./GenericTable";
import GenericDialog from "./GenericDialog"; // Novo dialog genérico
import ConfirmDialog from "./ConfirmDialog";
import { Column } from "../types/GenericTableProps";
import { Predio } from "../types/DataStructures/Predio";
import { getAllFromCollection, deleteItem, createItem, updateItem } from "../config/firebase";
import { DocumentData } from "firebase/firestore";
import "../styles/Predios.css";
import { useNavigate } from "react-router-dom";

export default function PrediosList() {

  const navigate = useNavigate();
  const [predios, setPredios] = useState<Predio[]>([]);
  const [selectedItem, setSelectedItem] = useState<Predio | null>(null);
  const [selectedRow, setSelectedRow] = useState<Predio | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Define se o dialog é para edição ou adição

  const columns: Column<Predio>[] = [
    { label: "Nome", dataKey: "nome", numeric: false, width: 100 },
    { label: "Descrição", dataKey: "descricao", numeric: false, width: 300 },
    { label: "Endereço", dataKey: "endereco", numeric: false, width: 150 },
    { label: "Número", dataKey: "numero", numeric: true, width: 50 },
    { label: "Bairro", dataKey: "bairro", numeric: false, width: 100 },
    { label: "Cidade", dataKey: "cidade", numeric: false, width: 100 },
    { label: "Estado", dataKey: "estado", numeric: false, width: 100 },
    { label: "CEP", dataKey: "cep", numeric: false, width: 100 },
    { label: "Latitude", dataKey: "latitude", numeric: true, width: 100 },
    { label: "Longitude", dataKey: "longitude", numeric: true, width: 100 },
    { label: "Capacidade", dataKey: "capacidade", numeric: true, width: 100 },
    { label: "Área", dataKey: "area", numeric: true, width: 100 },
  ];

  useEffect(() => {
    getAllFromCollection("predio").then((data: DocumentData[]) => {
      const predios: Predio[] = data.map((doc) => ({
        docId: doc.id,
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
        area: doc.area,
      }));
      setPredios(predios);
    });
  }, []);

  const handleOnAdicionarPredio = () => {
    setSelectedItem(null); // Limpa o item selecionado
    setIsEditing(false); // Define como adição
    setDialogOpen(true);
  };

  const handleOnEdit = (predio: Predio) => {
    setSelectedItem({ ...predio }); // Cria uma cópia do objeto para edição
    setIsEditing(true); // Define como edição
    setDialogOpen(true);
  };

  const handleOnDelete = (predio: Predio) => {
    setSelectedItem({ ...predio });
    setConfirmOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedItem(null);
  };

  const handleSave = (item: Predio) => {
    if (isEditing) {
      const sanitizedData = Object.fromEntries(
        Object.entries(item).filter(([_, value]) => value !== undefined)
      );
      setPredios((prevData) =>
        prevData.map((predio) => (predio.docId === item.docId ? {...predio, ...sanitizedData} : predio))
      );
      updateItem("predio", sanitizedData.docId, sanitizedData);
    } else {
      setPredios((prevData) => [...prevData, item]);
      createItem("predio", item);
    }
    setDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedItem) {
      setPredios((prevPredios) => prevPredios.filter((p) => p.docId !== selectedItem.docId));
      deleteItem("predio", selectedItem.docId);
      setConfirmOpen(false);
      setSelectedItem(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setSelectedItem(null);
  };

  const handleOnAbrirSalas = () => {
    navigate(`/predio/:${selectedRow?.nome}`);
  }

  return (
    <div>
      <div className="header">
        <Typography variant="h4" className="nome-pagina">
          <ApartmentIcon className="icon" />
          Prédios
        </Typography>
        <Button variant="contained" className="button" onClick={handleOnAdicionarPredio}>
          <ApartmentIcon className="icon" />
          Adicionar prédio
        </Button>
        <Button variant="contained" className="button" onClick={handleOnAbrirSalas} disabled={!selectedRow}>
          <MeetingRoomIcon className="icon" />
          Abrir Salas
        </Button>
      </div>
      <div className="body">
        <GenericTable
          columns={columns}
          data={predios}
          onEdit={handleOnEdit}
          onDelete={handleOnDelete}
          onSelectRow={(item) => setSelectedRow(item)} 
        />
        <ConfirmDialog
          title="Confirmar Exclusão"
          message={`Tem certeza que deseja excluir o prédio "${selectedItem?.nome}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          open={confirmOpen}
        />
        <GenericDialog
          open={dialogOpen}
          title={isEditing ? "Editar Prédio" : "Adicionar Prédio"}
          item={selectedItem}
          fields={[
            { label: "Nome", key: "nome", type: "text" },
            { label: "Descrição", key: "descricao", type: "text" },
            { label: "Endereço", key: "endereco", type: "text" },
            { label: "Número", key: "numero", type: "number" },
            { label: "Bairro", key: "bairro", type: "text" },
            { label: "Cidade", key: "cidade", type: "text" },
            { label: "Estado", key: "estado", type: "text" },
            { label: "CEP", key: "cep", type: "text" },
            { label: "Capacidade", key: "capacidade", type: "number" },
            { label: "Área", key: "area", type: "number" },
            { label: "Latitude", key: "latitude", type: "number" },
            { label: "Longitude", key: "longitude", type: "number" },
          ]}
          onClose={handleDialogClose}
          onSave={handleSave}
        />
      </div>
    </div>
  );  
}
