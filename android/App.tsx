/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState, useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  FlatList,
} from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './src/config/firebase'

function App(): React.JSX.Element {

  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    getBens(db)
  }, []);

  async function getBens(db: any) {
    const q = collection(db, 'bens')
    await onSnapshot(q, (snapshot) => {
      let tempData: any[] = []
      snapshot.forEach((doc) => {
        tempData.push({...doc.data(), id: doc.id})
      })
      setData(tempData)
      if (data.length > 0) {
        setError('Não foi possível carregar os dados')
      } else {
        setLoading(false)
      }
    })
  }

  function renderItem({item}: any) {
    return (
      <>
        <Text>{item.numero_patrimonio} | {item.descricao}</Text>
      </>
    )
  }

  if (loading) {
    return (
      <SafeAreaView>
        <Text>Loading...</Text>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView>
        <Text>{error}</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.descricao}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
