import { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import MeetingRoom from '@mui/icons-material/MeetingRoom';
import ComputerIcon from '@mui/icons-material/Computer';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import GenericTable from "./GenericTable";
import GenericDialog from "./GenericDialog"; // Novo dialog genérico
import { Column } from "../types/GenericTableProps";
import { getAllFromCollection, createItem } from "../config/firebase";
import { DocumentData, Timestamp } from "firebase/firestore";
import "../styles/Lists.css"; // Estilo alterado para conferencias
import { useNavigate } from "react-router-dom";
import { Conferencia } from "../types/DataStructures/Conferencia";
import { Sala } from "../types/DataStructures/Sala";

export default function ConferenciaList() {

  const navigate = useNavigate();

  const [conferenciasList, setConferenciasList] = useState<Conferencia[]>([]);
  const [selectedItem, setSelectedItem] = useState<Conferencia | null>(null);
  const [selectedRow, setSelectedRow] = useState<Conferencia | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [salas, setSalas] = useState<Sala[]>([]);

  const columns: Column<Conferencia>[] = [
    { label: "Data Solicitação", dataKey: "dataSolicitacao", numeric: false, width: 150 },
    { label: "Data Realização", dataKey: "dataRealizacao", numeric: false, width: 150 },
    { label: "Tipo", dataKey: "tipo", numeric: false, width: 150 },
    { label: "Local", dataKey: "local", numeric: false, width: 150 },
    { label: "Finalizada", dataKey: "finalizada", numeric: false, width: 150 },
  ];

  useEffect(() => {
      getAllFromCollection("conferencia").then((data: DocumentData[]) => {
        const conferencias: Conferencia[] = data.map((doc) => ({
          docId: doc.id,
          dataSolicitacao: new Timestamp((doc.dataSolicitacao as Timestamp).seconds, (doc.dataSolicitacao as Timestamp).nanoseconds).toDate(),
          dataRealizacao: new Timestamp((doc.dataRealizacao as Timestamp).seconds, (doc.dataRealizacao as Timestamp).nanoseconds).toDate(),
          tipo: doc.tipo,
          local: doc.local,
          bensRegistrados: doc.bensRegistrados,
          finalizada: doc.finalizada,
        }));
        setConferenciasList(conferencias);
      });
    }, []);

  const handleOnSolicitarConferencia = () => {
    getAllFromCollection("sala").then((data: DocumentData[]) => {
      const salas: Sala[] = data.map((doc) => ({
        docId: doc.id,
        nome: doc.nome,
        descricao: doc.descricao,
        sigla: doc.sigla,
        predio: doc.predio,
        telefone: doc.telefone,
        email: doc.email,
        numero: doc.numero,
        predioNome: doc.predioNome,
        deptoSigla: doc.deptoSigla,
        area: doc.area,
        latitude: doc.latitude,
        longitude: doc.longitude,
      }));
      setSalas(salas);
    });

    setSelectedItem(null);
    setDialogOpen(true);
  };

  const handleOnAbrirConferencia = () => {
    navigate(`/conferencia/${selectedRow?.dataRealizacao.toISOString().split("T")[0]}/${selectedRow?.tipo}/${selectedRow?.local}`); 
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedItem(null);
  };

  const handleSave = (item: Conferencia) => {
    getAllFromCollection("sala").then((data: DocumentData[]) => {
      const salas: Sala[] = data.map((doc) => ({
        docId: doc.id,
        nome: doc.nome,
        descricao: doc.descricao,
        sigla: doc.sigla,
        predio: doc.predio,
        telefone: doc.telefone,
        email: doc.email,
        numero: doc.numero,
        predioNome: doc.predioNome,
        deptoSigla: doc.deptoSigla,
        area: doc.area,
        latitude: doc.latitude,
        longitude: doc.longitude,
      }));
      setSalas(salas);
    })

    const sala = salas.find((sala) => sala.sigla === item.local.toString());
    
    if (!sala) {
      return;
    }

    const novaConferencia: Conferencia = {
      docId: "",
      dataSolicitacao: new Date(item.dataSolicitacao),
      dataRealizacao: new Date(item.dataRealizacao),
      tipo: item.tipo,
      local: sala,
      bensRegistrados: [],
      finalizada: "NÃO",
    };

    setConferenciasList((prevData) => [...prevData, novaConferencia]);
    createItem("conferencia", novaConferencia);
    setDialogOpen(false);
  };

  return (
    <div>
      <div className="header">
        <Typography variant="h4" className="nome-pagina">
          <MeetingRoom className="icon" />
          Conferências
        </Typography>
        <Button variant="contained" className="button" onClick={handleOnSolicitarConferencia}>
          <AddToQueueIcon className="icon" fontSize="medium" />
          Solicitar conferência
        </Button>
        <Button variant="contained" className="button" onClick={handleOnAbrirConferencia} disabled={!selectedRow}>
          <ComputerIcon className="icon" />
          Abrir Bens
        </Button>
      </div>
      <div className="body">
        <GenericTable 
          columns={columns}
          data={conferenciasList}
          onEdit={()=>{}}
          onDelete={()=>{}}
          onSelectRow={(item) => setSelectedRow(item)} 
          disableActionsColumn={true}
        />
        <GenericDialog
          open={dialogOpen}
          title={"Solicitar Conferência"}
          item={selectedItem}
          fields={[
            { label: "Data Solicitação", type: "date", key: "dataSolicitacao", disabled: true, defaultValue: new Date().toISOString().split("T")[0] },
            { label: "Data Realização", type: "date", key: "dataRealizacao", disabled: false },
            { label: "Tipo", type: "dropdown", key: "tipo", disabled: false, options: [
              { label: "Ordinária", value: "ordinaria" },
              { label: "Extraordinária", value: "extraordinaria" }
            ]
            },
            { label: "Local", type: "dropdown", key: "local", options: [
              ...salas.map((sala) => ({ label: sala.sigla, value: sala.sigla }))
            ], disabled: false },
          ]}
          onClose={handleDialogClose}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
