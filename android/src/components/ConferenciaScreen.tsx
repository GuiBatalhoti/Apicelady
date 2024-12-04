import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function ConferenciaScreen({route}: any) {

  const navigation = useNavigation();
  const item = route.params.item;

  console.log(item);

  return (
    <View>
      <Text>ConferenciaScreen</Text>
    </View>
  );
}

export default ConferenciaScreen;