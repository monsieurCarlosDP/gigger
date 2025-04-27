import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';





export default function HomeScreen() {
  const apiToken = process.env.EXPO_PUBLIC_API_KEY;
  const [data,setData] = useState()
  const getData = async ()=>{
    return await fetch('https://back.somostufestival.es/api/setlists?populate=*',{
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiToken}`
      }
    });
  }
  
  useEffect(()=>{
    getData().then(res=>res.json()).then(dataResponse=>setData(dataResponse))
  },[])

  useEffect(()=>
    console.log(data?.data)
  ,[data])


  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
