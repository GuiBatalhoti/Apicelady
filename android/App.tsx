import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import { SafeAreaView,Text, ScrollView, FlatList } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './src/config/firebase'
import LoadingScreen from './src/components/LoadingScreen';
import ErrorScreen from './src/components/ErrorScreen';
import HomeScreen from './src/components/HomeScreen';
import DrawerNav from './src/components/DrawerNav';

function App(): React.JSX.Element {

  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [hasError, setHasError] = useState<boolean>(false)
  const [errorMessage, setErrorMesage] = useState<string>('')

  useEffect(() => {
    getBens(db)
  }, []);

  function handleRetry() {
    setLoading(true)
    setHasError(false)
    getBens(db)
  }

  async function getBens(db: any) {
    const q = collection(db, 'bens')
    await onSnapshot(q, (snapshot) => {
      let tempData: any[] = []
      snapshot.forEach((doc) => {
        tempData.push({...doc.data(), id: doc.id})
      })
      setData(tempData)
      if (data) {
        setLoading(false)
      } else {
        setHasError(true)
        setErrorMesage('Não foi possível carregar os dados...')
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
      <LoadingScreen />
    )
  } 
  if (hasError) {
    return (
      <ErrorScreen errorMessage={errorMessage} onRetry={handleRetry} />
    )
  }

  return (
    <DrawerNav />
  );
}

export default App;
