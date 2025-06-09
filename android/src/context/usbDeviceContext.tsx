import React, { createContext, useState, useContext, useRef, useEffect, useCallback } from 'react';
import { Alert, DeviceEventEmitter } from 'react-native';
import { UsbSerialManager, Device, UsbSerial, Parity, EventData } from 'react-native-usb-serialport-for-android';
import { UsbDeviceContextType, USBDeviceProviderProps } from '../types/USBDeviceProps';

const UsbDeviceContext = createContext<UsbDeviceContextType>({
  receivedData: [], //somente o EPC da tag/ patrimônio
  usbDevice: React.createRef<UsbSerial | null>(),
});

export const USBDeviceProvider = ({ children }: USBDeviceProviderProps) => {
  const [receivedData, setReceivedData] = useState<string[]>([]);
  const [deviceSearchResult, setdeviceSearchResult] = useState<Device[]>([]);
  const [usbPermission, setUsbPermission] = useState<boolean>(false);
  const usbDevice = useRef<UsbSerial | null>(null);
  const usbconnected = useRef<boolean>(false);

  useEffect(() => {
    setInterval(() => {
      if (!usbconnected.current) {
        UsbSerialManager.list().then((devices) =>{
        if (devices.length > 0) {
          setdeviceSearchResult(devices);
        }
      })
    }
    }, 2000);
  }, []);

  const requestUSBPermission = async () => {
    try {
      const devices = await UsbSerialManager.list();
      const granted = await UsbSerialManager.tryRequestPermission(devices[0].deviceId);
      setUsbPermission(granted);
    } catch (error: any) {
      Alert.alert("Erro de Permissão", error.message);
    }
  };

  const connectDevice = async () => {
    try {
      const device = deviceSearchResult[0];
      usbDevice.current = await UsbSerialManager.open(device.deviceId, { baudRate: 115200, parity: Parity.None, dataBits: 8, stopBits: 1 });
      usbconnected.current = true;
      Alert.alert("Sucesso", "Conexão realizada com sucesso!");
    } catch (error: any) {
      console.log(error);
      Alert.alert("Erro", "Ocorreu algum erro na conexão, tente novamente...");
    }
  };

  useEffect(() => {
    if (!usbPermission) {
      requestUSBPermission();
    } 
    if (!usbconnected.current){
      connectDevice();
    }
    return () => {
      if (usbDevice.current) {
        usbDevice.current.close();
        usbconnected.current = false;
      }
    }
  }, [usbPermission,deviceSearchResult]);

  useEffect(() => {
    if (usbDevice.current) {
      usbDevice.current.onReceived(handleOnReceivedData);
    }
  }, [usbDevice.current?.onReceived]);

  const findMatchingEPC = (data: string) : string[] => {
    const match = data.match(/EPC:\d+/g);
    if (!match) return [];
    const epc = match.map(element => element.split(":")[1]);
    return epc;
  }

  const hex2string = (hex: string) => {
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
  }

  const handleOnReceivedData = useCallback((event: EventData) => {
    let data = event.data;
    data = hex2string(data);
    const EPCs = findMatchingEPC(data); //recebe apenas o número, já "limpo"
    setReceivedData([...EPCs]);
  }, []);

  return (
    <UsbDeviceContext.Provider value={{ receivedData, usbDevice }}>
      {children}
    </UsbDeviceContext.Provider>
  );
};

export const useUsbDeviceContext = () => useContext(UsbDeviceContext);