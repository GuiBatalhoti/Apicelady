import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { HomeItemProps } from '../types/HomeItemProps';

export function HomeItem({ sala, tipo, dataRealizacao, onItemPress }: HomeItemProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onItemPress}>
      <Text style={styles.text}>
        Sala: {sala}
      </Text>
      <Text style={styles.text}>
        Tipo: {tipo}
      </Text>
      <Text style={styles.text}>
        Data de Realização: {dataRealizacao}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#00ceff",
    borderRadius: 5,
    padding: 10,
    margin: 5,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});