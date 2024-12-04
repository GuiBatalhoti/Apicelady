import React, { useEffect, useState } from "react";
// import { useUsbDeviceContext } from "../context/usbDeviceContext";
import { View, Text, StyleSheet, ScrollView } from "react-native";
// import { ScreenProps } from "../types/ScreenProps";
// import { DataTable } from "./DataTable";
// import { UsbSerial } from "react-native-usb-serialport-for-android";
import { getAllFromCollection } from "../config/firebase";
import { Conferencia } from "../types/DataStructures/Conferencia";
import { Timestamp } from "firebase/firestore";
import { HomeItem } from './HomeItem';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from "../types/StackParam";

function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // const { receivedData, USBDevice } = useUsbDeviceContext() as unknown as { receivedData: string[], USBDevice: UsbSerial|null };
  const [tags, setTags] = useState<string[]>([]);
  const [conferenciasList, setConferenciasList] = useState<Conferencia[]>([]);

  useEffect(() => {
    getAllFromCollection('conferencia').then((data) => {
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
  },[]);

  const onItemPress = (item: { sala: string; tipo: string; dataRealizacao: string }) => {
    navigation.navigate('Conferencia', { item: item });
  }

  // const checkDuplicate = (tag: string) => {
  //   return tags.includes(tag);
  // };

  // useEffect(() => {
  //   let newTags: string[] = [];
  //   receivedData.forEach((tag) => {
  //     if (!checkDuplicate(tag)) {
  //       newTags.push(tag);
  //     };
  //   });
  //   setTags([...tags, ...newTags]);
  // },[receivedData]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Conferências Pendentes
      </Text>
      <ScrollView> 
        {conferenciasList.map((conf) => (
            <HomeItem
              key={conf.docId} // Adicione uma chave única aqui
              sala={conf.local.sigla}
              tipo={conf.tipo}
              dataRealizacao={conf.dataRealizacao.toISOString().split('T')[0]}
              onItemPress={onItemPress}
            />
          ))
        }
      </ScrollView>
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  text: {
    fontSize: 20,
    margin: 10,
    textAlign: 'center',
  },
});