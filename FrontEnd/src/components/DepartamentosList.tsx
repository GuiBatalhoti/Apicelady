import { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import StoreIcon from '@mui/icons-material/Store';
import GenericTable from "./GenericTable";
import GenericDialog from "./GenericDialog"; // Novo dialog genérico
import ConfirmDialog from "./ConfirmDialog";
import { Column } from "../types/GenericTableProps";
import { Departamento } from "../types/DataStructures/Departamento"; // Alterado para Departamento
import { getAllFromCollection, deleteItem, createItem, updateItem } from "../config/firebase";
import { DocumentData } from "firebase/firestore";
import "../styles/Lists.css"; // Estilo alterado para Departamentos
import { Predio } from "../types/DataStructures/Predio";

export default function DepartamentosList() {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [selectedItem, setSelectedItem] = useState<Departamento | null>(null);
  const [selectedRow, setSelectedRow] = useState<Departamento | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [predios, setPredios] = useState<Predio[]>([]);

  const columns: Column<Departamento>[] = [
    { label: "Nome", dataKey: "nome", numeric: false, width: 100 },
    { label: "Descrição", dataKey: "descricao", numeric: false, width: 300 },
    { label: "Sigla", dataKey: "sigla", numeric: false, width: 100 },
    { label: "Telefone", dataKey: "telefone", numeric: false, width: 150 },
    { label: "Email", dataKey: "email", numeric: false, width: 150 },
    { label: "Prédio", dataKey: "predio", numeric: false, width: 150 }, // Mantido para referência de prédios
  ];

  useEffect(() => {
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
  }, []);

  const handleOnAdicionarDepartamento = () => {
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
    setSelectedItem(null);
    setIsEditing(false);
    setDialogOpen(true);
  };

  const handleOnEdit = (departamento: Departamento) => {
    setSelectedItem({ ...departamento }); // Cria uma cópia do objeto para edição
    setIsEditing(true); // Define como edição
    setDialogOpen(true);
  };

  const handleOnDelete = (departamento: Departamento) => {
    setSelectedItem({ ...departamento });
    setConfirmOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedItem(null);
  };

  const handleSave = (item: Departamento) => {
    if (isEditing) {
      const sanitizedData = Object.fromEntries(
        Object.entries(item).filter(([_, value]) => value !== undefined)
      );
      setDepartamentos((prevData) =>
        prevData.map((departamento) => (departamento.docId === item.docId ? { ...departamento, ...sanitizedData } : departamento))
      );
      updateItem("departamento", sanitizedData.docId, sanitizedData);
    } else {
      setDepartamentos((prevData) => [...prevData, item]);
      createItem("departamento", item);
    }
    setDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedItem) {
      setDepartamentos((prevDepartamentos) => prevDepartamentos.filter((d) => d.nome !== selectedItem.nome));
      deleteItem("departamento", selectedItem.docId);
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
          Departamentos
        </Typography>
          <Button variant="contained" className="button" onClick={handleOnAdicionarDepartamento}>
            <StoreIcon className="icon" fontSize="medium"/>
            Adicionar Departamento
          </Button>
          <Button variant="contained" className="button" onClick={() => console.log("Abrindo salas para:", selectedRow)} disabled={!selectedRow}>
            
          Abrir salas
          </Button>
      </div>
      <div className="body">
        <GenericTable 
          columns={columns}
          data={departamentos}
          onEdit={handleOnEdit}
          onDelete={handleOnDelete}
          onSelectRow={(item) => setSelectedRow(item)} 
        />
        <ConfirmDialog
          title="Confirmar Exclusão"
          message={`Tem certeza que deseja excluir o departamento "${selectedItem?.nome}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          open={confirmOpen}
        />
        <GenericDialog
          open={dialogOpen}
          title={isEditing ? "Editar Departamento" : "Adicionar Departamento"}
          item={selectedItem}
          fields={ isEditing ? 
            [
              { label: "Nome", key: "nome", type: "text", disabled: true, },
              { label: "Descrição", key: "descricao", type: "text", disabled: false, },
              { label: "Sigla", key: "sigla", type: "text", disabled: false, },
              { label: "Telefone", key: "telefone", type: "fone", disabled: false, },
              { label: "Email", key: "email", type: "email", disabled: false, },
              { label: "Prédio", key: "predio", type: "dropdown", disabled: false, options: [
                ...predios.map((p) => ({ label: p.nome, value: p.nome }))
              ], defaultValue: selectedItem?.predio },
            ] :
            [
              { label: "Nome", key: "nome", type: "text", disabled: false, },
              { label: "Descrição", key: "descricao", type: "text", disabled: false, },
              { label: "Sigla", key: "sigla", type: "text", disabled: false, },
              { label: "Telefone", key: "telefone", type: "fone", disabled: false, },
              { label: "Email", key: "email", type: "email", disabled: false, },
              { label: "Prédio", key: "predio", type: "dropdown", disabled: false, options: [
                ...predios.map((p) => ({ label: p.nome, value: p.nome }))
              ]},
            ]
          }
          onClose={handleDialogClose}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
