import { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import MeetingRoom from '@mui/icons-material/MeetingRoom';
import ComputerIcon from '@mui/icons-material/Computer';
import GenericTable from "./GenericTable";
import GenericDialog from "./GenericDialog"; // Novo dialog genérico
import ConfirmDialog from "./ConfirmDialog";
import { Column } from "../types/GenericTableProps";
import { Bem } from "../types/DataStructures/Bem";
import { getAllFromCollection, deleteItem, createItem, updateItem } from "../config/firebase";
import { DocumentData } from "firebase/firestore";
import "../styles/Lists.css"; // Estilo alterado para Bems
import { useNavigate, useParams } from "react-router-dom";
import { Departamento } from "../types/DataStructures/Departamento";


export default function BemsList() {

  const navigate = useNavigate();
  const{ nome: nomePredio } = useParams();
  const{ sigla: siglaSala } = useParams();

  const [bemsList, setBemsList] = useState<Bem[]>([]);
  const [selectedItem, setSelectedItem] = useState<Bem | null>(null);
  const [selectedRow, setSelectedRow] = useState<Bem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [deptoResponsaveis, setDeptoResponsaveis] = useState<Departamento[]>([]);

  const columns: Column<Bem>[] = [
    { label: "Número", dataKey: "numero", numeric: true, width: 100 },
    { label: "Descrição", dataKey: "descricao", numeric: false, width: 300 },
    { label: "Data de Aquisição", dataKey: "data_aquisicao", numeric: false, width: 100 },
    { label: "Valor de Aquisição", dataKey: "valor_aquisicao", numeric: true, width: 100 },
    { label: "Valor Presente", dataKey: "valor_presente", numeric: true, width: 100 },
    { label: "Status", dataKey: "status", numeric: false, width: 100 },
    { label: "Condição de Uso", dataKey: "condicao_uso", numeric: false, width: 100 },
    { label: "Localização", dataKey: "localizacao", numeric: false, width: 100 },
    { label: "Responsável", dataKey: "responsavel", numeric: false, width: 100 },
  ];

  useEffect(() => {
      getAllFromCollection("Bem").then((data: DocumentData[]) => {
        const bens: Bem[] = data.map((doc) => ({
          docId: doc.id,
          numero: doc.numero,
          descricao: doc.descricao,
          data_aquisicao: doc.data_aquisicao,
          valor_aquisicao: doc.valor_aquisicao,
          valor_presente: doc.valor_presente,
          status: doc.status,
          condicao_uso: doc.condicao_uso,
          localizacao: doc.localizacao,
          responsavel: doc.responsavel,
        }));
        if (nomePredio) {
          console.log("Filtrando Bems por sala:", siglaSala);
          bens.filter((Bem) => String(Bem.localizacao) === String(siglaSala));
          setBemsList(bens.filter((Bem) => String(Bem.localizacao) === String(nomePredio)));
        } else {
          setBemsList(bens);
        }
      });
  }, []);

  const handleOnAdicionarBem = () => {
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
      setDeptoResponsaveis(departamentos);
    });
    setSelectedItem(null);
    setIsEditing(false);
    setDialogOpen(true);
  };

  const handleOnEdit = (Bem: Bem) => {
    setSelectedItem({ ...Bem }); // Cria uma cópia do objeto para edição
    setIsEditing(true); // Define como edição
    setDialogOpen(true);
  };

  const handleOnDelete = (Bem: Bem) => {
    setSelectedItem({ ...Bem });
    setConfirmOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedItem(null);
    setDeptoResponsaveis([]);
  };

  const handleSave = (item: Bem) => {
    if (isEditing) {
      const sanitizedData = Object.fromEntries(
        Object.entries(item).filter(([_, value]) => value !== undefined)
      );
      setBemsList((prevData) =>
        prevData.map((Bem) => (Bem.docId === item.docId ? { ...Bem, ...sanitizedData } : Bem))
      );
      updateItem("bem", sanitizedData.docId, sanitizedData);
    } else {
      setBemsList((prevData) => [...prevData, item]);
      createItem("bem", item);
    }
    setDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedItem) {
      setBemsList((prevBems) => prevBems.filter((d) => d.numero !== selectedItem.numero));
      deleteItem("bem", selectedItem.docId);
      setConfirmOpen(false);
      setSelectedItem(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setSelectedItem(null);
  };

  const handleOnVoltar = () => {
    navigate(`/predio/${nomePredio}`);
  };

  return (
    <div>
      <div className="header">
        <Typography variant="h4" className="nome-pagina" >
          <ComputerIcon  className="icon" fontSize="medium"/>
          Bem
        </Typography>
        <Button variant="contained" className="button" onClick={handleOnVoltar}>
          <MeetingRoom />
          Voltar
        </Button>
        <Button variant="contained" className="button" onClick={handleOnAdicionarBem}>
          <ComputerIcon />
          Adicionar Bem
        </Button>
      </div>
      <div className="body">
        <GenericTable 
          columns={columns}
          data={bemsList}
          onEdit={handleOnEdit}
          onDelete={handleOnDelete}
          onSelectRow={(item) => setSelectedRow(item)} 
        />
        <ConfirmDialog
          title="Confirmar Exclusão"
          message={`Tem certeza que deseja excluir a Bem "${selectedItem?.numero}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          open={confirmOpen}
        />
        <GenericDialog
          open={dialogOpen}
          title={isEditing ? "Editar Bems" : "Adicionar Bems"}
          item={selectedItem}
          fields={isEditing? 
            [ 
              { label: "Número", key: "numero", type: "number", disabled: true },
              { label: "Descrição", key: "descricao", type: "text", disabled: false },
              { label: "Data de Aquisição", key: "data_aquisicao", type: "date", disabled: true },
              { label: "Valor de Aquisição", key: "valor_aquisicao", type: "number", disabled: true },
              { label: "Valor Presente", key: "valor_presente", type: "number", disabled: false },
              { label: "Status", key: "status", type: "dropdown", disabled: false, options: [
                { label: "Ativo", value: "ativo" },
                { label: "Baixa", value: "baixa"}
                ], defaultValue: "ativo" 
              },
              { label: "Condição de Uso", key: "condicao_uso", type: "text", disabled: false },
              { label: "Localização", key: "localizacao", type: "text", disabled: true },
              { label: "Responsável", key: "responsavel", type: "text", disabled: true }
            ]
            :
            [
              { label: "Número", key: "numero", type: "number", disabled: false },
              { label: "Descrição", key: "descricao", type: "text", disabled: false },
              { label: "Data de Aquisição", key: "data_aquisicao", type: "date", disabled: false },
              { label: "Valor de Aquisição", key: "valor_aquisicao", type: "number", disabled: false },
              { label: "Valor Presente", key: "valor_presente", type: "number", disabled: false },
              { label: "Status", key: "status", type: "dropdown", disabled: false, options: [
                { label: "Ativo", value: "ativo" },
                { label: "Baixa", value: "baixa"}
                ], defaultValue: "ativo" 
              },
              { label: "Condição de Uso", key: "condicao_uso", type: "text", disabled: false },
              { label: "Localização", key: "localizacao", type: "text", disabled: true, defaultValue: siglaSala },
              { label: "Responsável", key: "responsavel", type: "dropdown", disabled: false, options: [
                ...deptoResponsaveis.map((d) => ({ label: d.sigla, value: d.sigla }))
              ]}
            ]
          }
          onClose={handleDialogClose}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
