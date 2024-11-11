import React, { useEffect, useState } from "react";
import { useUsbDeviceContext } from "../context/usbDeviceContext";
import { View, Text, StyleSheet } from "react-native";
import { ScreenProps } from "../interfaces/interfaces";
import { DataTable } from "./DataTable";
import { UsbSerial } from "react-native-usb-serialport-for-android";


function HomeScreen({ navigation }: ScreenProps) {

  const { receivedData, USBDevice } = useUsbDeviceContext() as unknown as { receivedData: string[], USBDevice: UsbSerial|null };
  const [data, setData] = useState<string[]>([]);

  useEffect(() => {
    setData(["001"]); // Simulando um dado recebido
  },[]);

  useEffect(() => {
    const previousData = [...data];
    if (receivedData.length > 0) {
      setData([...previousData, receivedData[0]]);
    }
  },[receivedData]);


  return (
    <View style={styles.container}>
      <Text style={styles.text}>USB Device: {USBDevice?.deviceId ? USBDevice.deviceId : 'Nenhum dispositivo conectado'}</Text>     
      <DataTable data={data}/>
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