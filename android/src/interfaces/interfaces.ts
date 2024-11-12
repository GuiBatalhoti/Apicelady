import { DrawerNavigationProp } from '@react-navigation/drawer';
import { ParamListBase } from '@react-navigation/native';
import { ReactNode } from 'react';
import { UsbSerial } from 'react-native-usb-serialport-for-android';

export interface ScreenProps {
    navigation: DrawerNavigationProp<ParamListBase>;
}

export interface USBDeviceProviderProps {
    children: ReactNode;
}

export interface UsbDeviceContextType {
    receivedData: string[];
    usbDevice: React.RefObject<UsbSerial | null>
}

export interface USBDeviceType {
    serialDevice: UsbSerial | null;
}