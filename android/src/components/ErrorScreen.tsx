// ErrorScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface ErrorScreenProps {
  errorMessage: string;
  onRetry: () => void;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ errorMessage, onRetry }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>Ocorreu um erro</Text>
      <Text style={styles.errorMessage}>{errorMessage}</Text>
      <Button title="Tentar Novamente" onPress={onRetry} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8d7da',
  },
  errorText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#721c24',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: '#721c24',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default ErrorScreen;
