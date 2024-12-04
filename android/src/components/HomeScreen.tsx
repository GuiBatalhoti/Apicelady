import React, { useEffect, useState } from "react";
import { useUsbDeviceContext } from "../context/usbDeviceContext";
import { View, Text, StyleSheet, Button } from "react-native";
import { ScreenProps } from "../types/ScreenProps";
import { DataTable } from "./DataTable";
import { UsbSerial } from "react-native-usb-serialport-for-android";

function HomeScreen({ navigation }: ScreenProps) {

  const { receivedData, USBDevice } = useUsbDeviceContext() as unknown as { receivedData: string[], USBDevice: UsbSerial|null };
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    setTags(["01"]); // Simulando um dado recebido
  },[]);

  const checkDuplicate = (tag: string) => {
    return tags.includes(tag);
  };

  useEffect(() => {
    let newTags: string[] = [];
    receivedData.forEach((tag) => {
      if (!checkDuplicate(tag)) {
        newTags.push(tag);
      };
    });
    setTags([...tags, ...newTags]);
  },[receivedData]);

  const handleStartCapture = () => {
    // Implementar
  }

  const handleCheckPat = () => {
    // tags.forEach(async (tag) => {
    //   const result = await checkPat(tag);
    //   if (result) {
    //     console.log(`Patrimônio ${tag} encontrado`);
    //   } else {
    //     console.log(`Patrimônio ${tag} não encontrado`);
    //   }
    // });
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <Button title="Limpar Dados" onPress={()=>{setTags([])}} />
        <Button title="Conferir Patrimônios" onPress={handleCheckPat} />
      </View>
      {/* <Text style={styles.text}>USB Device: {USBDevice?.deviceId ? USBDevice.deviceId : 'Nenhum dispositivo conectado'}</Text>      */}
      <DataTable data={tags}/>
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