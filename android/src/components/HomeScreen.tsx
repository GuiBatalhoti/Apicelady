import React, { useEffect, useState } from "react";
import { useUsbDeviceContext } from "../context/usbDeviceContext";
import { SafeAreaView, View, Text, Image } from "react-native";
import { ScreenProps, USBDeviceType } from "../interfaces/interfaces";
import { useUSBMonitor } from "./USBMonitor";

function HomeScreen({ navigation }: ScreenProps) {

  useUSBMonitor();

  const { config: USBDevice, updateConfig: updateUSBDeviceContext } = useUsbDeviceContext() as { config: USBDeviceType, updateConfig: (config: USBDeviceType) => void };

  const [receivedData, setReceivedData] = useState<string[]>([]);

  useEffect(() => {
    if (USBDevice.serialDevice?.deviceId) {
      const interval = setInterval(() => {
          USBDevice.serialDevice?.onReceived((event) => {
          let dataString = hexToText(event.data);
          setReceivedData([...receivedData, dataString]);
          // return receivedData + event.data;
        });
      }, 1);
      return () => clearInterval(interval);
    } else {
      setReceivedData([]);
    }
  }, [USBDevice.serialDevice?.deviceId]); 

  

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

  return (
    <SafeAreaView>
      <View>
        <Text>Home Screen</Text>
        <Image
          source={{ uri: "https://reactnative.dev/docs/assets/p_cat2.png" }}
          style={{ width: 200, height: 200 }}
        />
        <Text>USB Device: {USBDevice.serialDevice ? USBDevice.serialDevice.deviceId : 'Nenhum dispositivo conectado'}</Text>
        
        {USBDevice.serialDevice?.deviceId && receivedData ? (
          <Text>{receivedData}</Text> // Mostra os dados recebidos quando o dispositivo está conectado
        ) : (
          <Text>Nenhum dado disponível</Text> // Mostra mensagem quando o dispositivo não está conectado ou sem dados
        )}
        
      </View>
    </SafeAreaView>
  );
}

export default HomeScreen;