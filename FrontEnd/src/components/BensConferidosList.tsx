import { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import ComputerIcon from '@mui/icons-material/Computer';
import GenericTable from "./GenericTable";
import GenericDialog from "./GenericDialog"; // Novo dialog genérico
import { Bem, historico } from "../types/DataStructures/Bem";
import { Conferencia } from "../types/DataStructures/Conferencia";
import { getAllFromCollection, updateItem } from "../config/firebase";
import { DocumentData, Timestamp } from "firebase/firestore";
import "../styles/Lists.css"; // Estilo alterado para Bems
import { useNavigate, useParams } from "react-router-dom";
import { Departamento } from "../types/DataStructures/Departamento";


export default function BemsConferidosList() {

  const navigate = useNavigate();
  const{ dataRealizacao: dataRealizacao } = useParams();
  const{ local: local } = useParams();
  const{ docId: docId } = useParams();

  const [conferenciaBemsList, setConferenciaBemsList] = useState<Bem[]>([]);
  const [conferencia, setConferencia] = useState<Conferencia | undefined>();
  const [selectedRow, setSelectedRow] = useState<Bem | null>(null);
  const [transferirDialogOpen, setTransferirDialogOpen] = useState(false);

  const [deptoResponsaveis, setDeptoResponsaveis] = useState<Departamento[]>([]);
  const [allSalas, setSalas] = useState<string[]>([]);

  useEffect(() => {
    getAllFromCollection("conferencia").then((data: DocumentData[]) => {
      const conferencias: Conferencia[] = data.map((doc) => ({
        docId: doc.id,
        dataSolicitacao: new Timestamp(doc.dataSolicitacao.seconds, doc.dataSolicitacao.nanoseconds).toDate(),
        dataRealizacao: new Timestamp(doc.dataRealizacao.seconds, doc.dataRealizacao.nanoseconds).toDate(),
        tipo: doc.tipo,
        local: doc.local,
        bensRegistrados: doc.bensRegistrados.map((bem: Bem) => ({
          docId: bem.docId,
          numero: bem.numero,
          descricao: bem.descricao,
          data_aquisicao: new Timestamp(bem.data_aquisicao.seconds, bem.data_aquisicao.nanoseconds).toDate(),
          valor_aquisicao: bem.valor_aquisicao,
          valor_presente: bem.valor_presente,
          status: bem.status,
          condicao_uso: bem.condicao_uso,
          localizacao: bem.localizacao.map((loc: any) => loc.data ? ({
            data: new Timestamp(loc.data.seconds, loc.data.nanoseconds).toDate(),
            atributo: loc.atributo,
          }) : loc),
          responsavel: bem.responsavel.map((resp: any) => resp.data ? ({
            data: new Timestamp(resp.data.seconds, resp.data.nanoseconds).toDate(),
            atributo: resp.atributo,
          }) : resp),
          conferido: bem.conferido ? bem.conferido.map((conf: any) => conf.data ? ({
            data: new Timestamp(conf.data.seconds, conf.data.nanoseconds).toDate(),
            atributo: conf.atributo,
          }) : conf) : [],
          })
          ),
        finalizada: doc.finalizada,
      }));

      const conferencia = conferencias.find((conf) => conf.docId === docId);
      console.log("Conferencia:", conferencia);
      setConferenciaBemsList(conferencia?.bensRegistrados || []);
    });
  }, [local]);

  const handleDialogClose = () => {
    setTransferirDialogOpen(false);
    setDeptoResponsaveis([]);
  };

  const handleOnVoltar = () => {
    navigate(`/conferencias`);
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

      setConferenciaBemsList((prevData) =>
        prevData.map((bem) => (bem.docId === sanitizedItem.docId ? sanitizedItem : bem))
      );
      updateItem("bem", sanitizedItem.docId, sanitizedItem);
      setTransferirDialogOpen(false);
      setSelectedRow(null);
    }
  };

  const getRowColor = (row: Bem): string => {
    if (row.localizacao.length === 0) {
      return "#fff3cd";
    }
    if (row.localizacao[row.localizacao.length - 1].atributo !== local) {
      return "#f8d7da";
    }
    if (row.localizacao[row.localizacao.length - 1].atributo === local) {
      return "#d4edda";
    }
    return "#fff3cd";
  }

  return (
    <div>
      <div className="header">
        <Typography variant="h5" className="nome-pagina" >
          <AddToQueueIcon  className="icon" fontSize="large"/>
          Conferência da Sala {local}<br/>
          Data de Realização: {dataRealizacao}      
        </Typography>
        <Button variant="contained" className="button" onClick={handleOnVoltar}>
          <AddToQueueIcon />
          Voltar para Conferências
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
          data={conferenciaBemsList}
          onEdit={() => {}}
          onDelete={() => {}}
          onSelectRow={(item) => setSelectedRow(item)} 
          disableActionsColumn={true}
          rowColor={getRowColor}
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
