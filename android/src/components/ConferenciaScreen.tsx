import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUsbDeviceContext } from '../context/usbDeviceContext';
import { UsbSerial } from 'react-native-usb-serialport-for-android';
import { DataTable } from './DataTable';
import { Bem } from '../types/DataStructures/Bem';
import { getAllFromCollection, updateItem } from '../config/firebase';
import { DocumentData, Timestamp } from 'firebase/firestore';
import { Conferencia } from '../types/DataStructures/Conferencia';

function ConferenciaScreen({ route }: any) {
  const navigation = useNavigation();
  const item = route.params.item;
  const { receivedData, USBDevice } = useUsbDeviceContext() as unknown as { receivedData: string[], USBDevice: UsbSerial | null };

  const [tags, setTags] = useState<string[]>([]);
  const [bemsList, setBemsList] = useState<Bem[]>([]);
  const [totalBemsSala, setTotalBemsSala] = useState<number>(0);
  const [bemsCapturados, setBemsCapturados] = useState<Bem[]>([]);

  // Carregar lista de bens ao montar
  useEffect(() => {
    const loadBens = async () => {
      const data: DocumentData[] = await getAllFromCollection("bem");
      const bens: Bem[] = data.map(doc => ({
        docId: doc.id,
        numero: doc.numero,
        descricao: doc.descricao,
        data_aquisicao: doc.data_aquisicao.toDate(),
        valor_aquisicao: doc.valor_aquisicao,
        valor_presente: doc.valor_presente,
        status: doc.status,
        condicao_uso: doc.condicao_uso,
        localizacao: doc.localizacao.map((loc: any) => loc.data ? ({
          data: new Timestamp(loc.data.seconds, loc.data.nanoseconds).toDate(),
          atributo: loc.atributo,
        }) : loc),
        responsavel: doc.responsavel || [],
        conferido: doc.conferido || [],
      }));

      const filteredBens = bens.filter(
        bem => bem.localizacao[bem.localizacao.length - 1]?.atributo === item.sala
      );

      setBemsList(filteredBens);
      setTotalBemsSala(filteredBens.length);
    };

    loadBens();
  }, [item.sala]);

  // Atualizar tags ao receber novos dados
  useEffect(() => {
    if (receivedData.length > 0) {
      setTags(prevTags => {
        const newTags = receivedData.filter(tag => !prevTags.includes(tag));
        return newTags.length > 0 ? [...prevTags, ...newTags] : prevTags;
      });
    }
  }, [receivedData]);

  const handleOnFinalizarConferirBems = useCallback(async () => {
    const data: DocumentData[] = await getAllFromCollection("conferencia");
    const conferencias: Conferencia[] = data.map(doc => ({
      docId: doc.id,
      dataSolicitacao: new Timestamp(doc.dataSolicitacao.seconds, doc.dataSolicitacao.nanoseconds).toDate(),
      dataRealizacao: new Timestamp(doc.dataRealizacao.seconds, doc.dataRealizacao.nanoseconds).toDate(),
      tipo: doc.tipo,
      local: doc.local,
      bensRegistrados: doc.bensRegistrados || [],
      finalizada: doc.finalizada,
    }));

    const confAtual = conferencias.find(
      conf =>
        conf.docId === item.docId
    );

    if (confAtual) {
      confAtual.finalizada = "SIM";
      confAtual.bensRegistrados = bemsCapturados;
      await updateItem("conferencia", confAtual.docId, confAtual);
      Alert.alert("Conferência Finalizada", "A conferência foi finalizada com sucesso.");
      navigation.goBack();
    }
  }, [bemsCapturados, item, navigation]);

  const getRowColor = useCallback((row: string): string => {
    const bem = bemsList.find(bem => bem.numero.toString() === row);

    if (bem) {
      const isAlreadyCaptured = bemsCapturados.some(captured => captured.numero === bem.numero);
      if (!isAlreadyCaptured) {
        setBemsCapturados(prev => [...prev, bem]);
      }

      if (bem.localizacao[bem.localizacao.length - 1]?.atributo !== item.sala) {
        return "#f8d7da"; // Vermelho para localização incorreta
      }
      return "#d4edda"; // Verde para localização correta
    }

    return "#fff3cd"; // Amarelo para não encontrado
  }, [bemsList, bemsCapturados, item.sala]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>A Sala {item.sala} possui {totalBemsSala} bens alocados. </Text>
      <Text style={styles.text}>Foram capturados {bemsCapturados.length} bens. </Text>
      <View style={styles.buttonRow}>
        <Button title="Finalizar Conferência" onPress={handleOnFinalizarConferirBems} />
      </View>
      <DataTable
        data={tags}
        getRowColor={getRowColor}
      />
    </View>
  );
}

export default ConferenciaScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  text: {
    fontSize: 18,
    margin: 10,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
