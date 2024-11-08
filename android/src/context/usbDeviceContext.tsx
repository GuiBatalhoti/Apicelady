import React, { createContext, useState, useContext, useRef, useEffect } from 'react';
import { Alert } from 'react-native';
import { UsbSerialManager, Device, UsbSerial, Parity, EventData } from 'react-native-usb-serialport-for-android';
import { UsbDeviceContextType, USBDeviceProviderProps } from '../interfaces/interfaces';

const UsbDeviceContext = createContext<UsbDeviceContextType>({
  receivedData: [],
  usbDevice: React.createRef<UsbSerial | null>(),
});

export const USBDeviceProvider = ({ children }: USBDeviceProviderProps) => {
  // const [config, setConfig] = useState<any>({serialDevice: null});
  const [receivedData, setReceivedData] = useState<string[]>([]);

  const [result, setResult] = useState<Device[]>([]);
  const [USBPermission, setUSBPermission] = useState<boolean>(false);
  const usbDevice = useRef<UsbSerial | null>(null);

  useEffect(() => {
    setInterval(() => {
      UsbSerialManager.list().then((devices) =>{
        console.log('Devices:', devices);
        if (devices.length > 0) {
          setResult(devices);
        }
      })
    }, 5000);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const devices = await UsbSerialManager.list();
        const granted = await UsbSerialManager.tryRequestPermission(devices[0].deviceId);
        setUSBPermission(granted);
      } catch (error: any) {
        Alert.alert("Erro de Permissão", error.message);
      }
    })();
    if (USBPermission) {
      async () => {
        try {
          usbDevice.current = await UsbSerialManager.open(result[0].deviceId, { baudRate: 115200, parity: Parity.None, dataBits: 8, stopBits: 1 });
          Alert.alert("Sucesso", "Conexão realizada com sucesso!");
      } catch (error: any) {
          console.log(error);
          Alert.alert("Erro", "Ocorreu algum erro na conexão, tente novamente...");
      }
      }
    }
    return () => {
      if (usbDevice.current) {
        usbDevice.current.close();
      }
    }
  }, [USBPermission,usbDevice, result]);

  useEffect(() => {
    if (usbDevice.current) {
      usbDevice.current.onReceived(handleOnReceivedData);
    }
  }, [usbDevice.current?.onReceived]);

  const findMatchingEPC = (data: string) => {
    const match = data.match(/EPC:\d+/);
    const epc = match ? match[0].split(':') : '';
    return epc[1];
  }

  const handleOnReceivedData = (event: EventData) => {
    const data = event.data;
    const recievedDataList = data.split('$');
    setReceivedData([]);
    if (recievedDataList.length > 2) {
      recievedDataList.forEach((data: string) => {
        setReceivedData([...receivedData, findMatchingEPC(data)]);
      });
    } else {
      const data = recievedDataList[0];
      setReceivedData([...receivedData, findMatchingEPC(data)]);
    }
  }

  return (
    <UsbDeviceContext.Provider value={{ receivedData, usbDevice }}>
      {children}
    </UsbDeviceContext.Provider>
  );
};

export const useUsbDeviceContext = () => useContext(UsbDeviceContext);