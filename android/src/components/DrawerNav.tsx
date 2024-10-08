import 'react-native-gesture-handler';
import * as React from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator, DrawerScreenProps, DrawerNavigationProp } from '@react-navigation/drawer';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import HomeScreen from './HomeScreen';

interface ScreenProps {
    navigation: DrawerNavigationProp<ParamListBase>;
}

// TODO: remover NotificationsScreen, apenas temporário para fins de teste
function NotificationsScreen({ navigation }: ScreenProps) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}

const Drawer = createDrawerNavigator();

export default function DrawerNav() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};