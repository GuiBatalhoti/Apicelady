import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import LoadingScreen from './src/components/LoadingScreen';
import { USBDeviceProvider } from './src/context/usbDeviceContext';
import HomeScreen from './src/components/HomeScreen';

function App(): React.JSX.Element {

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  },[]);

  if (loading) {
    return (
      <LoadingScreen />
    )
  }

  return (
    <USBDeviceProvider>
      <HomeScreen />
    </USBDeviceProvider>
  );
}

export default App;
