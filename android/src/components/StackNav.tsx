import React from 'react';
import { createNativeStackNavigator  } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import { NavigationContainer } from '@react-navigation/native';

// Criar a stack
const Stack = createNativeStackNavigator ();

function StackNav() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNav;