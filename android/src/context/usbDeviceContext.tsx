import React, { createContext, useState, useContext } from 'react';
import { USBDeviceProviderProps } from '../interfaces/interfaces';

const UsbDeviceContext = createContext({
  config: {
    serialDevice: null,
  },
  updateConfig: (newConfig: any) => {},
});

export const USBDeviceProvider = ({ children }: USBDeviceProviderProps) => {
  // Define the config states (you can add as many as needed)
  const [config, setConfig] = useState<any>({
    serialDevice: null,
  });

  // Define any update functions if necessary
  const updateConfig = (newConfig: any) => {
    setConfig((prevConfig: any) => ({
      ...prevConfig,
      ...newConfig,
    }));
  };

  return (
    <UsbDeviceContext.Provider value={{ config, updateConfig }}>
      {children}
    </UsbDeviceContext.Provider>
  );
};

// Custom hook to use the Config context
export const useUsbDeviceContext = () => useContext(UsbDeviceContext);