import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

function LoadingScreen() {
  return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="dodgerblue" />
        <Text>Carregando...</Text>
      </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingtext: {
        fontSize: 25,
        fontWeight: 'bold',
    }
});

export default LoadingScreen;