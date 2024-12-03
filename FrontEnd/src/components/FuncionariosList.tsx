import { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import StoreIcon from '@mui/icons-material/Store';
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
  const{ sigla: deptoSigla } = useParams();

  const [funcionariosList, setfuncionariosList] = useState<Funcionario[]>([]);
  const [selectedItem, setSelectedItem] = useState<Funcionario | null>(null);
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
  ];

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
        if (deptoSigla) {
            console.log("Filtrando funcionarios por predio:", deptoSigla);
            setfuncionariosList(funcionarios.filter((funcionario) => String(funcionario.deptoSigla) === String(deptoSigla)));
        } else {
            setfuncionariosList(funcionarios);
        }
      });
  }, [deptoSigla]);

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

  const handleOnVoltar = (path: "home" | "depto") => {
    if (path === "home") {
      navigate("/");
    } else {
      navigate(`/departamentos`);
    }
  };

  function setSelectedRow(item: Funcionario | null): void {
    console.log("Funcionario selecionado:", item);
  }

  return (
    <div>
      <div className="header">
        <Typography variant="h4" className="nome-pagina">
          <PersonIcon className="icon" />
          {deptoSigla ? `Funcionários do Departamento ${deptoSigla}` : "Funcionarios"}
        </Typography>
        {deptoSigla? 
          <Button variant="contained" className="button" onClick={() => handleOnVoltar("depto")}>
            <StoreIcon className="icon" />
            Voltar Departamentos
          </Button>
          :
          null
        }
        <Button variant="contained" className="button" onClick={handleOnAdicionarfuncionario}>
          <PersonIcon className="icon" fontSize="medium" />
          Adicionar Funcionários
        </Button>
      </div>
      <div className="body">
        <GenericTable 
          columns={columns}
          data={funcionariosList}
          onEdit={handleOnEdit}
          onDelete={handleOnDelete}
          onSelectRow={(item) => setSelectedRow(item)}
          disableSelectColumn={true}
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
                { label: "Nome", key: "nome", type: "text", disabled: true },
                { label: "Email", key: "email", type: "text", disabled: false },
                { label: "Endereço", key: "endereco", type: "text", disabled: false },
                { label: "Departamento", key: "deptoSigla", type: "dropdown", disabled: false, options: [
                    ...departamentos.map((d) => ({ label: d.sigla, value: d.sigla }))
                ]
                },
                { label: "Cargo", key: "cargo", type: "text", disabled: false },
                { label: "Função", key: "funcao", type: "text", disabled: false },
                ]
            :
            [ 
                { label: "Nome", key: "nome", type: "text", disabled: false },
                { label: "Email", key: "email", type: "text", disabled: false },
                { label: "Endereço", key: "endereco", type: "text", disabled: false },
                { label: "Departamento", key: "deptoSigla", type: "dropdown", disabled: false, options: deptoSigla ? 
                  [{label: deptoSigla, value: deptoSigla }]
                  :
                  [...departamentos.map((d) => ({ label: d.sigla, value: d.sigla }))]
                },
                { label: "Cargo", key: "cargo", type: "text", disabled: false },
                { label: "Função", key: "funcao", type: "text", disabled: false },
            ]
          }
          onClose={handleDialogClose}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
