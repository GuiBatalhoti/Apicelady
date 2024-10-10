import React, { useEffect, useState } from "react";
import { useUsbDeviceContext } from "../context/usbDeviceContext";
import { View, Text, StyleSheet } from "react-native";
import { ScreenProps, USBDeviceType } from "../interfaces/interfaces";
import { useUSBMonitor } from "./USBMonitor";
import { DataTable } from "./DataTable";

// const testingData = [
//   { tag: "TAG-001", patrimonio: "001", descricao: "Descrição do patrimônio 001" },
//   { tag: "TAG-002", patrimonio: "002", descricao: "Descrição do patrimônio 002" },
//   { tag: "TAG-003", patrimonio: "003", descricao: "Descrição do patrimônio 003" },
//   { tag: "TAG-004", patrimonio: "004", descricao: "Descrição do patrimônio 004" },
//   { tag: "TAG-005", patrimonio: "005", descricao: "Descrição do patrimônio 005" },
//   { tag: "TAG-006", patrimonio: "006", descricao: "Descrição do patrimônio 006" },
//   { tag: "TAG-007", patrimonio: "007", descricao: "Descrição do patrimônio 007" },
//   { tag: "TAG-008", patrimonio: "008", descricao: "Descrição do patrimônio 008" },
//   { tag: "TAG-009", patrimonio: "009", descricao: "Descrição do patrimônio 009" },
//   { tag: "TAG-010", patrimonio: "010", descricao: "Descrição do patrimônio 010" },
//   { tag: "TAG-011", patrimonio: "011", descricao: "Descrição do patrimônio 011" },
//   { tag: "TAG-012", patrimonio: "012", descricao: "Descrição do patrimônio 012" },
// ];


function HomeScreen({ navigation }: ScreenProps) {

  useUSBMonitor();

  const { config: USBDevice, updateConfig: updateUSBDeviceContext } = useUsbDeviceContext() as { config: USBDeviceType, updateConfig: (config: USBDeviceType) => void };

  const [receivedData, setReceivedData] = useState<string[]>([]);

  function hexToText(hexString: string): string {
    // Remove qualquer espaço ou separador, se houver
    hexString = hexString.replace(/\s+/g, '');
  
    // Verifica se a string tem um número par de caracteres
    if (hexString.length % 2 !== 0) {
      throw new Error("A string hexadecimal deve ter um número par de caracteres.");
    }
  
    let text = '';
    for (let i = 0; i < hexString.length; i += 2) {
      const hexPair = hexString.substring(i, i + 2);
      const charCode = parseInt(hexPair, 16);
      text += String.fromCharCode(charCode);
    }
  
    return text;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      if (USBDevice.serialDevice?.deviceId) {
        USBDevice.serialDevice?.onReceived((event) => {
          let receivedData = event.data;
          let text = hexToText(receivedData);
          setReceivedData(text.split('\n'));
        });
      }
      return () => clearTimeout(timer);
    }, 1000);
  });


  return (
    <View style={styles.container}>
      <Text style={styles.text}>USB Device: {USBDevice.serialDevice ? USBDevice.serialDevice.deviceId : 'Nenhum dispositivo conectado'}</Text>     
      <DataTable data={receivedData}/>
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
  input: {
    height: 40,
    width: 150,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});