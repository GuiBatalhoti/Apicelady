import { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import StoreIcon from '@mui/icons-material/Store';
import ComputerIcon from '@mui/icons-material/Computer';
import GenericTable from "./GenericTable";
import GenericDialog from "./GenericDialog"; // Novo dialog genérico
import ConfirmDialog from "./ConfirmDialog";
import { Column } from "../types/GenericTableProps";
import { Sala } from "../types/DataStructures/Sala";
import { getAllFromCollection, deleteItem, createItem, updateItem } from "../config/firebase";
import { DocumentData } from "firebase/firestore";
import "../styles/Salas.css"; // Estilo alterado para salas
import { useNavigate, useParams } from "react-router-dom";

export default function SalasList() {

  const navigate = useNavigate();
  let{ nome: nomePredio } = useParams();
  nomePredio = nomePredio?.replace(/:/g, "");

  const [salasList, setSalasList] = useState<Sala[]>([]);
  const [selectedItem, setSelectedItem] = useState<Sala | null>(null);
  const [selectedRow, setSelectedRow] = useState<Sala | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Define se o dialog é para edição ou adição

  const columns: Column<Sala>[] = [
    { label: "Nome", dataKey: "nome", numeric: false, width: 100 },
    { label: "Sigla", dataKey: "sigla", numeric: false, width: 100 },
    { label: "Número", dataKey: "numero", numeric: true, width: 100 },
    { label: "Departamento", dataKey: "deptoSigla", numeric: false, width: 100 },
    { label: "Descrição", dataKey: "descricao", numeric: false, width: 300 },
    { label: "Prédio", dataKey: "predioNome", numeric: false, width: 100 },
    { label: "Área", dataKey: "area", numeric: true, width: 100 },
    { label: "Latitude", dataKey: "latitude", numeric: true, width: 100 },
    { label: "Longitude", dataKey: "longitude", numeric: true, width: 100 },
  ];

  useEffect(() => {
      getAllFromCollection("sala").then((data: DocumentData[]) => {
        const salas: Sala[] = data.map((doc) => ({
          docId: doc.id,
          nome: doc.nome,
          numero: doc.numero,
          descricao: doc.descricao,
          deptoSigla: doc.deptoSigla,
          predioNome: doc.predioNome,
          area: doc.area,
          latitude: doc.latitude,
          longitude: doc.longitude,
          sigla: doc.sigla,
        }));
        if (nomePredio) {
          console.log("Filtrando salas por predio:", nomePredio);
          setSalasList(salas.filter((sala) => String(sala.predioNome) === String(nomePredio)));
        } else {
          setSalasList(salas);
        }
      });
  }, []);

  const handleOnAdicionarsala = () => {
    setSelectedItem(null); // Limpa o item selecionado
    setIsEditing(false); // Define como adição
    setDialogOpen(true);
  };

  const handleOnAbrirBens = () => {
    navigate(`/salas/${selectedRow?.sigla}`);
  }

  const handleOnEdit = (sala: Sala) => {
    setSelectedItem({ ...sala }); // Cria uma cópia do objeto para edição
    setIsEditing(true); // Define como edição
    setDialogOpen(true);
  };

  const handleOnDelete = (sala: Sala) => {
    setSelectedItem({ ...sala });
    setConfirmOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedItem(null);
  };

  const handleSave = (item: Sala) => {
    if (isEditing) {
      const sanitizedData = Object.fromEntries(
        Object.entries(item).filter(([_, value]) => value !== undefined)
      );
      setSalasList((prevData) =>
        prevData.map((sala) => (sala.docId === item.docId ? { ...sala, ...sanitizedData } : sala))
      );
      updateItem("sala", sanitizedData.docId, sanitizedData);
    } else {
      setSalasList((prevData) => [...prevData, item]);
      createItem("sala", item);
    }
    setDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedItem) {
      setSalasList((prevsalas) => prevsalas.filter((d) => d.nome !== selectedItem.nome));
      deleteItem("sala", selectedItem.nome);
      setConfirmOpen(false);
      setSelectedItem(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setSelectedItem(null);
  };

  return (
    <div>
      <div className="header">
        <Typography variant="h4" className="nome-pagina">
          <StoreIcon className="icon" />
          Salas
        </Typography>
        <Button variant="contained" className="button" onClick={handleOnAdicionarsala}>
          <StoreIcon className="icon" />
          Adicionar Salas
        </Button>
        <Button variant="contained" className="button" onClick={handleOnAbrirBens} disabled={!selectedRow}>
          <ComputerIcon className="icon" />
          Abrir Bens
        </Button>
      </div>
      <div className="body">
        <GenericTable 
          columns={columns}
          data={salasList}
          onEdit={handleOnEdit}
          onDelete={handleOnDelete}
          onSelectRow={(item) => setSelectedRow(item)} 
        />
        <ConfirmDialog
          title="Confirmar Exclusão"
          message={`Tem certeza que deseja excluir a sala "${selectedItem?.nome}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          open={confirmOpen}
        />
        <GenericDialog
          open={dialogOpen}
          title={isEditing ? "Editar Salas" : "Adicionar Salas"}
          item={selectedItem}
          fields={isEditing? 
            [ { label: "Nome", key: "nome", type: "text" },
              { label: "Sigla", key: "sigla", type: "text" },
              { label: "Número", key: "numero", type: "number" },
              { label: "Departamento", key: "depto", type: "text" },
              { label: "Descrição", key: "descricao", type: "text" },
              { label: "Prédio", key: "predioNome", type: "text" },
              { label: "Área", key: "area", type: "number" },
              { label: "Latitude", key: "latitude", type: "number" },
              { label: "Longitude", key: "longitude", type: "number" }, ]
            :
            [ { label: "Nome", key: "nome", type: "text" },
              { label: "Sigla", key: "sigla", type: "text" },
              { label: "Número", key: "numero", type: "number" },
              { label: "Departamento", key: "depto", type: "text" },
              { label: "Descrição", key: "descricao", type: "text" },
              { label: "Prédio", key: "predioNome", type: "text", defaultValue: nomePredio },
              { label: "Área", key: "area", type: "number" },
              { label: "Latitude", key: "latitude", type: "number" },
              { label: "Longitude", key: "longitude", type: "number" }, ]
          }
          onClose={handleDialogClose}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
