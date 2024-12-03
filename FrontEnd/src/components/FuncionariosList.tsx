import { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import MeetingRoom from '@mui/icons-material/MeetingRoom';
import ComputerIcon from '@mui/icons-material/Computer';
import ApartmentIcon from "@mui/icons-material/Apartment";
import GenericTable from "./GenericTable";
import GenericDialog from "./GenericDialog"; // Novo dialog genérico
import ConfirmDialog from "./ConfirmDialog";
import { Column } from "../types/GenericTableProps";
import { Funcionario } from "../types/DataStructures/Funcionario";
import { getAllFromCollection, deleteItem, createItem, updateItem } from "../config/firebase";
import { DocumentData } from "firebase/firestore";
import "../styles/Lists.css"; // Estilo alterado para funcionarios
import { useNavigate, useParams } from "react-router-dom";
import { Departamento } from "../types/DataStructures/Departamento";

export default function FuncionariosList() {

  const navigate = useNavigate();
  const{ nome: nomePredio } = useParams();

  const [funcionariosList, setfuncionariosList] = useState<Funcionario[]>([]);
  const [selectedItem, setSelectedItem] = useState<Funcionario | null>(null);
  const [selectedRow, setSelectedRow] = useState<Funcionario | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Define se o dialog é para edição ou adição

  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);

  const columns: Column<Funcionario>[] = [
    { label: "Nome", dataKey: "nome", numeric: false, width: 150 },
    { label: "Email", dataKey: "email", numeric: false, width: 150 },
    { label: "Endereço", dataKey: "endereco", numeric: false, width: 150 },
    { label: "Departaento", dataKey: "deptoSigla", numeric: false, width: 100 },
    { label: "Cargo", dataKey: "cargo", numeric: false, width: 100 },
    { label: "Função", dataKey: "funcao", numeric: false, width: 100 },
  ]
    

  useEffect(() => {
      getAllFromCollection("funcionario").then((data: DocumentData[]) => {
        const funcionarios: Funcionario[] = data.map((doc) => ({
            docId: doc.id,
            nome: doc.nome,
            email: doc.email,
            endereco: doc.endereco,
            deptoSigla: doc.deptoSigla,
            cargo: doc.cargo,
            funcao: doc.funcao,
            }));
        if (nomePredio) {
            console.log("Filtrando funcionarios por predio:", nomePredio);
            setfuncionariosList(funcionarios.filter((funcionario) => String(funcionario.predioNome) === String(nomePredio)));
        } else {
            setfuncionariosList(funcionarios);
        }
      });
  }, [nomePredio]);

  const handleOnAdicionarfuncionario = () => {
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
    navigate(`/predio/${selectedRow?.predioNome}/funcionario/${selectedRow?.sigla}`);
  }

  const handleOnEdit = (funcionario: Funcionario) => {
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
    setSelectedItem({ ...funcionario }); // Cria uma cópia do objeto para edição
    setIsEditing(true); // Define como edição
    setDialogOpen(true);
  };

  const handleOnDelete = (funcionario: Funcionario) => {
    setSelectedItem({ ...funcionario });
    setConfirmOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedItem(null);
  };

  const handleSave = (item: Funcionario) => {
    if (isEditing) {
      const sanitizedData = Object.fromEntries(
        Object.entries(item).filter(([_, value]) => value !== undefined)
      );
      setfuncionariosList((prevData) =>
        prevData.map((funcionario) => (funcionario.docId === item.docId ? { ...funcionario, ...sanitizedData } : funcionario))
      );
      updateItem("funcionario", sanitizedData.docId, sanitizedData);
    } else {
      setfuncionariosList((prevData) => [...prevData, item]);
      createItem("funcionario", item);
    }
    setDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedItem) {
      setfuncionariosList((prevfuncionarios) => prevfuncionarios.filter((d) => d.nome !== selectedItem.nome));
      deleteItem("funcionario", selectedItem.nome);
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
          funcionarios
        </Typography>
        <Button variant="contained" className="button" onClick={handleOnVoltar}>
          <ApartmentIcon className="icon" />
          Voltar
        </Button>
        <Button variant="contained" className="button" onClick={handleOnAdicionarfuncionario}>
          <MeetingRoom className="icon" fontSize="medium" />
          Adicionar funcionarios
        </Button>
        <Button variant="contained" className="button" onClick={handleOnAbrirBens} disabled={!selectedRow}>
          <ComputerIcon className="icon" />
          Abrir Bens
        </Button>
      </div>
      <div className="body">
        <GenericTable 
          columns={columns}
          data={funcionariosList}
          onEdit={handleOnEdit}
          onDelete={handleOnDelete}
          onSelectRow={(item) => setSelectedRow(item)} 
        />
        <ConfirmDialog
          title="Confirmar Exclusão"
          message={`Tem certeza que deseja excluir a funcionario "${selectedItem?.nome}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          open={confirmOpen}
        />
        <GenericDialog
          open={dialogOpen}
          title={isEditing ? "Editar funcionarios" : "Adicionar funcionarios"}
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
