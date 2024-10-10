import React, { useEffect, useState } from "react";
import { useUsbDeviceContext } from "../context/usbDeviceContext";
import { View, Text, StyleSheet } from "react-native";
import { ScreenProps, USBDeviceType } from "../interfaces/interfaces";
import { useUSBMonitor } from "./USBMonitor";
import { DataTable } from "./DataTable";

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

        });
      }
      return () => clearTimeout(timer);
    }, 1000);
  });


  return (
    <View style={styles.container}>
      <Text style={styles.text}>USB Device: {USBDevice.serialDevice ? USBDevice.serialDevice.deviceId : 'Nenhum dispositivo conectado'}</Text>     
      <DataTable a={receivedData}/>
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
  },
  input: {
    height: 40,
    width: 150,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});