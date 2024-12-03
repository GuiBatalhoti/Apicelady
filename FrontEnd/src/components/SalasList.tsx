import { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import MeetingRoom from '@mui/icons-material/MeetingRoom';
import ComputerIcon from '@mui/icons-material/Computer';
import ApartmentIcon from "@mui/icons-material/Apartment";
import GenericTable from "./GenericTable";
import GenericDialog from "./GenericDialog"; // Novo dialog genérico
import ConfirmDialog from "./ConfirmDialog";
import { Column } from "../types/GenericTableProps";
import { Sala } from "../types/DataStructures/Sala";
import { getAllFromCollection, deleteItem, createItem, updateItem } from "../config/firebase";
import { DocumentData } from "firebase/firestore";
import "../styles/Lists.css"; // Estilo alterado para salas
import { useNavigate, useParams } from "react-router-dom";
import { Departamento } from "../types/DataStructures/Departamento";

export default function SalasList() {

  const navigate = useNavigate();
  const{ nome: nomePredio } = useParams();

  const [salasList, setSalasList] = useState<Sala[]>([]);
  const [selectedItem, setSelectedItem] = useState<Sala | null>(null);
  const [selectedRow, setSelectedRow] = useState<Sala | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Define se o dialog é para edição ou adição

  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);

  const columns: Column<Sala>[] = [
    { label: "Nome", dataKey: "nome", numeric: false, width: 150 },
    { label: "Sigla", dataKey: "sigla", numeric: false, width: 40 },
    { label: "Número", dataKey: "numero", numeric: true, width: 40 },
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
  }, [nomePredio]);

  const handleOnAdicionarsala = () => {
    getAllFromCollection("departamento").then((data: DocumentData[]) => {
      const departamentos: Departamento[] = data.map((doc) => ({
        docId: doc.id,
        nome: doc.nome,
        descricao: doc.descricao,
        sigla: doc.sigla,
        predio: doc.predio,
        telefone: doc.telefone,
        email: doc.email,
      }));
      setDepartamentos(departamentos);
    });

    setSelectedItem(null);
    setIsEditing(false);
    setDialogOpen(true);
  };

  const handleOnAbrirBens = () => {
    navigate(`/predio/${selectedRow?.predioNome}/sala/${selectedRow?.sigla}`);
  }

  const handleOnEdit = (sala: Sala) => {
    getAllFromCollection("departamento").then((data: DocumentData[]) => {
      const departamentos: Departamento[] = data.map((doc) => ({
        docId: doc.id,
        nome: doc.nome,
        descricao: doc.descricao,
        sigla: doc.sigla,
        predio: doc.predio,
        telefone: doc.telefone,
        email: doc.email,
      }));
      setDepartamentos(departamentos);
    });
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

  const handleOnVoltar = () => {
    navigate(`/predios`);
  };

  return (
    <div>
      <div className="header">
        <Typography variant="h4" className="nome-pagina">
          <MeetingRoom className="icon" />
          {nomePredio ? `Salas do Prédio ${nomePredio}` : "Salas"}
        </Typography>
        <Button variant="contained" className="button" onClick={handleOnVoltar}>
          <ApartmentIcon className="icon" />
          Voltar
        </Button>
        <Button variant="contained" className="button" onClick={handleOnAdicionarsala}>
          <MeetingRoom className="icon" fontSize="medium" />
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
            [ 
              { label: "Nome", key: "nome", type: "text", disabled: false },
              { label: "Sigla", key: "sigla", type: "text", disabled: false },
              { label: "Número", key: "numero", type: "number", disabled: false },
              { label: "Departamento", key: "deptoSigla", type: "dropdown", disabled: false, options: [
                ...departamentos.map((d) => ({ label: d.sigla, value: d.sigla }))
              ], defaultValue: selectedItem?.deptoSigla
              },
              { label: "Descrição", key: "descricao", type: "text", disabled: false },
              { label: "Prédio", key: "predioNome", type: "text", disabled: true },
              { label: "Área", key: "area", type: "number", disabled: false },
              { label: "Latitude", key: "latitude", type: "number", disabled: false },
              { label: "Longitude", key: "longitude", type: "number", disabled: false }, 
            ]
            :
            [ 
              { label: "Nome", key: "nome", type: "text", disabled: false },
              { label: "Sigla", key: "sigla", type: "text", disabled: false },
              { label: "Número", key: "numero", type: "number", disabled: false },
              { label: "Departamento", key: "depto", type: "dropdown", disabled: false, options: [
                ...departamentos.map((d) => ({ label: d.sigla, value: d.sigla }))
              ]
              },
              { label: "Descrição", key: "descricao", type: "text", disabled: false },
              { label: "Prédio", key: "predioNome", type: "text", defaultValue: nomePredio, disabled: true },
              { label: "Área", key: "area", type: "number", disabled: false },
              { label: "Latitude", key: "latitude", type: "number", disabled: false },
              { label: "Longitude", key: "longitude", type: "number", disabled: false }, 
            ]
          }
          onClose={handleDialogClose}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
