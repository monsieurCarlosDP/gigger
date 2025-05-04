import SongList from '@/components/Songs/SongList';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSetlistService } from '@/hooks/setlists/setlists';
import { DataObject, ISetlistListItemViewModelV1Body, ISongListItemViewModelV1Body } from '@/src/data/data-contracts';
import { ISetlistItemDTO } from '@/src/services/setlist-service/interface-setlist-service';
import { Box, Flex, HStack, VStack, Surface } from '@react-native-material/core';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect } from 'react';


type Props = {
    setList: ISetlistItemDTO
}

type TSeachparams = {
  
    setlist: string;
  
}

const Route = (props: Props) => {

  const navigation = useNavigation();
  
  const { setlist } = useLocalSearchParams<TSeachparams>();
  const {
    setlistData,
    isLoadingSetlist
  } = useSetlistService(setlist);
  
  const { data, meta } = setlistData ?? {};
  const { id, attributes } = data as DataObject<ISetlistListItemViewModelV1Body> ?? {};
  const { Name: title, songs } = attributes ?? {};
  const { data: songsData } = songs ?? {};
  const numberOfSongs = songsData?.length ?? 0;
  
  
  const calculateDuration = (songsData:DataObject<ISongListItemViewModelV1Body>[]) => {
    if (!songsData || !songsData.length) return 0;
    const seconds = songsData.reduce((total:number,song: DataObject<ISongListItemViewModelV1Body>)=>{
      return total + song.attributes.Duration;
    },0);
    
    const minutes = seconds / 60;
    const hours = minutes / 60;
    
    return `${hours>1 ? hours+'h ' : ''}${minutes>1?Math.floor(minutes)+'m ':''}`
    
    
  }
    
  useEffect(()=>{
    if(title)
      navigation.setOptions({title:title});
  },[title,navigation])
    
  return (
    <>    
    <Flex>
      <VStack p={24} spacing={12}>
        <HStack>
          <Surface 
            elevation={3}
            category="medium"      
            style={{width: '100%',flexGrow:1}}      
            >
            <Box m={24}>
                <ThemedText type='title'>{title}</ThemedText>
                <ThemedText type='subtitle'>{title}</ThemedText>
            </Box>
          </Surface>  
        </HStack>        
        <HStack h={48}>
          <Surface 
            elevation={3}
            category="medium"      
            style={{width: '100%',flexGrow:1}}      
            >
            <Box 
              style={{
                flex:1,
                justifyContent: 'center'
              }}
              ph={24}
            >
              <ThemedText>Creado el </ThemedText>
            </Box>
          </Surface>  
        </HStack>        
        <HStack spacing={12}>
          <Surface 
            elevation={3}
            category="medium"      
            style={{width: '40%'}}      
            >
            <Box m={24}>
                <ThemedText type='title2'>{numberOfSongs}</ThemedText>
                <ThemedText type='subtitle2'>Canciones</ThemedText>
            </Box>
          </Surface>  
          <Surface 
            elevation={3}
            category="medium"      
            style={{flexGrow:1}}      
            >
            <Box m={24}>
                <ThemedText type='title2'>{calculateDuration(songsData as DataObject<ISongListItemViewModelV1Body>[])}</ThemedText>
                <ThemedText type='subtitle2'>Duración aprox</ThemedText>
            </Box>
          </Surface>  
        </HStack>      
        <HStack>
          <Surface
            elevation={3}
            category='medium'
            style={{flexGrow:1}}  
            >
            <SongList songs={songs}/>  
          </Surface>
        </HStack>
      </VStack>
    </Flex>
    </>
  )
}

export default Route