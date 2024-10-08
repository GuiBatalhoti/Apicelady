import 'react-native-gesture-handler';
import * as React from 'react';
import { createDrawerNavigator, DrawerNavigationProp } from '@react-navigation/drawer';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import HomeScreen from './HomeScreen';
import ConnectDeviceScreen from './ConnectDeviceScreen';

const Drawer = createDrawerNavigator();

export default function DrawerNav() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Conectar ao dispositivo" component={ConnectDeviceScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};