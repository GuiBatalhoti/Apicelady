import React from 'react';
import { createNativeStackNavigator  } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './HomeScreen';
import ConferenciaScreen from './ConferenciaScreen';

// Criar a stack
const Stack = createNativeStackNavigator();

function StackNav() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Conferencia" component={ConferenciaScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNav;