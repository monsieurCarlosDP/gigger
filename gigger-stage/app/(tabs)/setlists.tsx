import { Image, StyleSheet, Platform, FlatList } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import React, {  useState } from 'react';
import { useSetlistsService } from '@/hooks/setlists/setlists';
import SetlistListItem from '@/components/SetlistList/SetlistListitem';
import { useRouter } from 'expo-router';



export default function HomeScreen() {
  const router = useRouter();
    
  const {isLoadingSetlists, setlistsData, setlistsError } = useSetlistsService();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      
      headerImage={
        <Image
          source={require('@/assets/images/banner-setlists.webp')}
          style={styles.img}
        />
      }>
        {
          setlistsData && Array.isArray(setlistsData.data) && setlistsData?.data.map((data,index)=>{
            return <SetlistListItem key={index} data={data}/>
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
  img: {
    bottom: 0,
    left: -250,
    position: 'absolute',
  },
});
