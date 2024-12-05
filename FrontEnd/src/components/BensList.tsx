import { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import MeetingRoom from '@mui/icons-material/MeetingRoom';
import ComputerIcon from '@mui/icons-material/Computer';
import GenericTable from "./GenericTable";
import GenericDialog from "./GenericDialog"; // Novo dialog genérico
import ConfirmDialog from "./ConfirmDialog";
import { Bem, historico } from "../types/DataStructures/Bem";
import { getAllFromCollection, deleteItem, createItem, updateItem } from "../config/firebase";
import { DocumentData, Timestamp } from "firebase/firestore";
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
  const [addEditDialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [transferirDialogOpen, setTransferirDialogOpen] = useState(false);

  const [deptoResponsaveis, setDeptoResponsaveis] = useState<Departamento[]>([]);
  const [allSalas, setSalas] = useState<string[]>([]);

  useEffect(() => {
    getAllFromCollection("bem").then((data: DocumentData[]) => {
      const bens: Bem[] = data.map((doc) => ({
        docId: doc.id,
        numero: doc.numero,
        descricao: doc.descricao,
        data_aquisicao: new Timestamp(doc.data_aquisicao.seconds, doc.data_aquisicao.nanoseconds).toDate(),
        valor_aquisicao: doc.valor_aquisicao,
        valor_presente: doc.valor_presente,
        status: doc.status,
        condicao_uso: doc.condicao_uso,
        localizacao: doc.localizacao.map((loc: any) => loc.data ? ({
          data: new Timestamp(loc.data.seconds, loc.data.nanoseconds).toDate(),
          atributo: loc.atributo,
        }) : loc),
        responsavel: doc.responsavel.map((resp: any) => resp.data ? ({
          data: new Timestamp(resp.data.seconds, resp.data.nanoseconds).toDate(),
          atributo: resp.atributo,
        }) : resp),
        conferido: doc.conferido ? doc.conferido.map((conf: any) => conf.data ? ({
          data: new Timestamp(conf.data.seconds, conf.data.nanoseconds).toDate(),
          atributo: conf.atributo,
        }) : conf) : [],
      }));
      if (nomePredio) {
        const filteredBens = bens.filter((bem) => bem.localizacao[bem.localizacao.length - 1].atributo === siglaSala);
        setBemsList(filteredBens);
      } else {
        setBemsList(bens);
      }
    });
  }, [nomePredio, siglaSala]);

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
    setTransferirDialogOpen(false);
    setSelectedItem(null);
    setDeptoResponsaveis([]);
  };

  const handleSave = (item: Bem) => {
    const localizacaoList: historico[] = [{
      data: new Date(),
      atributo: item.localizacao.toString() 
    }];
    const responsaveisList: historico[] = [{
      data: new Date(),
      atributo: item.responsavel.toString(),
    }];

    const sanitizedItem: Bem = {
      ...item,
      data_aquisicao: new Date(item.data_aquisicao),
      localizacao: localizacaoList, 
      responsavel: responsaveisList,
    };
  
    if (isEditing) {
      setBemsList((prevData) =>
        prevData.map((bem) => (bem.docId === sanitizedItem.docId ? { ...bem, ...sanitizedItem } : bem))
      );
      updateItem("bem", sanitizedItem.docId, sanitizedItem);
    } else {
      sanitizedItem.docId = Date.now().toString();
      setBemsList((prevData) => [...prevData, sanitizedItem]);
      createItem("bem", sanitizedItem);
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

  const handleOnTransferirBem = () => {
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
    getAllFromCollection("sala").then((data: DocumentData[]) => {
      const salas: string[] = data.map((doc) => doc.sigla);
      setSalas(salas);
    });
    setIsEditing(true);
    setTransferirDialogOpen(true);
  };
  
  const handleConfirmTransferirBem = (item: any) => {
    console.log("Transferindo Bem:", item);
    if (selectedRow) {

      let sanitizedItem: Bem = { ...selectedRow };
      if (selectedRow.localizacao[selectedRow.localizacao.length - 1].atributo !== item.localizacao) {
        const localizacaoList: historico[] = [{
          data: new Date(),
          atributo: item.localizacao.toString(),
        }];
        sanitizedItem = {
          ...selectedRow,
          localizacao: selectedRow.localizacao.concat(localizacaoList),
        };
      }
      if (selectedRow.responsavel[selectedRow.responsavel.length - 1].atributo !== item.responsavel) {
        const responsaveisList: historico[] = [{
          data: new Date(),
          atributo: item.responsavel.toString(),
        }];
        sanitizedItem = {
          ...selectedRow,
          responsavel: selectedRow.responsavel.concat(responsaveisList),
        };
      }

      setBemsList((prevData) =>
        prevData.map((bem) => (bem.docId === sanitizedItem.docId ? sanitizedItem : bem))
      );
      updateItem("bem", sanitizedItem.docId, sanitizedItem);
      setTransferirDialogOpen(false);
      setSelectedRow(null);
    }
  };

  return (
    <div>
      <div className="header">
        <Typography variant="h4" className="nome-pagina" >
          <ComputerIcon  className="icon" fontSize="medium"/>
          {siglaSala ? `Bens da Sala ${siglaSala}` : "Bens"}
        </Typography>
        <Button variant="contained" className="button" onClick={handleOnVoltar}>
          <MeetingRoom />
          Voltar para Salas
        </Button>
        <Button variant="contained" className="button" onClick={handleOnAdicionarBem}>
          <ComputerIcon />
          Adicionar Bem
        </Button>
        <Button variant="contained" className="button" onClick={handleOnTransferirBem} disabled={!selectedRow}>
          <ComputerIcon className="icon" />
          Transferir Bem
        </Button>
      </div>
      <div className="body">
        <GenericTable 
          columns={ 
            [
            { label: "Número", dataKey: "numero", numeric: true, width: 60 },
            { label: "Descrição", dataKey: "descricao", numeric: false, width: 200 },
            { label: "Data de Aquisição", dataKey: "data_aquisicao", numeric: false, width: 80 },
            { label: "Valor de Aquisição", dataKey: "valor_aquisicao", numeric: true, width: 100 },
            { label: "Valor Presente", dataKey: "valor_presente", numeric: true, width: 100 },
            { label: "Status", dataKey: "status", numeric: false, width: 50 },
            { label: "Condição de Uso", dataKey: "condicao_uso", numeric: false, width: 100 },
            { label: "Localização", dataKey: "localizacao", numeric: false, width: 180 },
            { label: "Responsável", dataKey: "responsavel", numeric: false, width: 180 },
            { label: "Conferido", dataKey: "conferido", numeric: false, width: 180 }
            ]
          }
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
          open={addEditDialogOpen}
          title={isEditing ? "Editar Bens" : "Adicionar Bens"}
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
                ], defaultValue: selectedItem?.status
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

        <GenericDialog
          open={transferirDialogOpen}
          title={"Transferir Bem"}
          item={selectedRow}
          fields={
            [
              { label: "Localização", key: "localizacao", type: "dropdown", disabled: false, options: [
                ...allSalas.map((s) => ({ label: s, value: s }))
              ], defaultValue: selectedRow?.localizacao[selectedRow?.localizacao.length - 1].atributo,
              isArray: true },
              { label: "Responsável", key: "responsavel", type: "dropdown", disabled: false, options: [
                ...deptoResponsaveis.map((d) => ({ label: d.sigla, value: d.sigla }))
              ], defaultValue: selectedRow?.responsavel[selectedRow?.responsavel.length - 1].atributo,
              isArray: true }
            ]
          }
          onClose={handleDialogClose}
          onSave={handleConfirmTransferirBem}
        />

      </div>
    </div>
  );
}
