import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useEffect, useState } from 'react';
import { useServiceContext } from '@/src/context/service-context';
import { useSetlistsService } from '@/hooks/setlists/setlists';
import SetlistListItem from '@/components/SetlistList/SetlistListitem';





export default function HomeScreen() {

  const [data,setData] = useState()

const {isLoadingSetlists, setlistsData, setlistsError } = useSetlistsService();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
        {
          setlistsData?.data.map((data,index)=>{
            return <SetlistListItem key={index} title={data.attributes.Name}/>
          })
        }
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
