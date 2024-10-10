import { useEffect } from "react";
import { useUsbDeviceContext } from "../context/usbDeviceContext"; // Contexto para gerenciar o dispositivo USB
import { USBDeviceType } from "../interfaces/interfaces";
import { UsbSerialManager } from "react-native-usb-serialport-for-android";

// Hook para monitorar se o dispositivo USB está conectado
export const useUSBMonitor = () => {
  const { config: USBDevice, updateConfig: updateUSBDeviceContext } = useUsbDeviceContext() as { config: USBDeviceType, updateConfig: (config: USBDeviceType) => void };

  useEffect(() => {
    const interval = setInterval(() => {
      const isUSBConnected = checkUSBDeviceStatus();
      
      if (!isUSBConnected) {
        updateUSBDeviceContext({ ...USBDevice, serialDevice: null });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [USBDevice, updateUSBDeviceContext]);

  const checkUSBDeviceStatus = async () => {
    const devices = await UsbSerialManager.list();
    const deviceId = devices[0].deviceId;
    
    return deviceId !== null;
  };
};
