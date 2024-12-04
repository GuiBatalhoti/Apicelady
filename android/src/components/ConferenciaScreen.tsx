import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUsbDeviceContext } from '../context/usbDeviceContext';
import { UsbSerial } from 'react-native-usb-serialport-for-android';
import { DataTable } from './DataTable';
import { Bem } from '../types/DataStructures/Bem';
import { getAllFromCollection } from '../config/firebase';
import { DocumentData, Timestamp } from 'firebase/firestore';

function ConferenciaScreen({route}: any) {

  const navigation = useNavigation();
  const item = route.params.item;
  const { receivedData, USBDevice } = useUsbDeviceContext() as unknown as { receivedData: string[], USBDevice: UsbSerial|null };

  const [tags, setTags] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [bemsList, setBemsList] = useState<Bem[]>([]);
  const [totalBemsSala, setTotalBemsSala] = useState<number>(0);
  const [bemsCapturados, setBemsCapturados] = useState<number>(0);

  const checkDuplicate = (tag: string) => {
    return tags.includes(tag);
  };

  
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
      }
    ));

    const filteredBens = bens.filter((bem) => bem.localizacao[bem.localizacao.length - 1].atributo === item.sala);
    setBemsList(filteredBens);
    setTotalBemsSala(filteredBens.length);
    });
  },[]);

  useEffect(() => {
    if (isCapturing) {
      let newTags: string[] = [];
      receivedData.forEach((tag) => {
        if (!checkDuplicate(tag)) {
          newTags.push(tag);
        };
      });
      setTags([...tags, ...newTags]);
    }
  },[receivedData]);

  const handleOnFinalizarConferirBems = () => {
    // Implementar
  }

  const getRowColor = (row: string): string => {
    const bem = bemsList.find((bem) => bem.numero.toString() === row);

    if (bem?.localizacao !== item.sala) {
      return "#f8d7da";
    }
    if (bem?.localizacao === item.sala) {
      return "#d4edda";
    }
    return "#fff3cd";
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>A Sala {item.sala} possui {totalBemsSala} bens alocados. </Text>
      <Text style={styles.text}>Foram capturados {bemsCapturados} bens. </Text>
      <View style={styles.buttonRow}>
        <Button title="Iniciar Captura" onPress={() => setIsCapturing(true)} />
        <Button title="Finalizar Conferência" onPress={handleOnFinalizarConferirBems} />
      </View>
      <DataTable 
      data={tags}
      getRowColor={getRowColor} />
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
  input: {
    height: 40,
    width: 150,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});