import 'react-native-gesture-handler';
import React from 'react';
import { USBDeviceProvider } from './src/context/usbDeviceContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StackNav from './src/components/StackNav';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {

  return (
    <USBDeviceProvider>
      <StackNav />
    </USBDeviceProvider>
  );
}

export default App;
