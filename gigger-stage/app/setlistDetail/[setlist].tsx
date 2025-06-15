import SongList from '@/components/Songs/SongList';
import SongListItem from '@/components/Songs/SongListItem';
import TagGroup from '@/components/Tags/TagGroup';
import { ThemedText } from '@/components/ThemedText';
import { useSetlistService } from '@/hooks/setlists/setlists';
import { DataObject, ISetlistListItemViewModelV1Body, ISongListItemViewModelV1Body, ITagsItemViewModelV1Body } from '@/src/data/data-contracts';
import { ISetlistItemDTO } from '@/src/services/setlist-service/interface-setlist-service';
import { Box, Flex, HStack, VStack, Surface } from '@react-native-material/core';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect } from 'react';
import { FlatList, View } from 'react-native';


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
  const { id, attributes } = data ?? {};
  const { Name: title, songs } = attributes ?? {};
  const { data: songsData } = songs ?? {};
  const numberOfSongs = songsData?.length ?? 0;
  const presentTags = new Set<DataObject<ITagsItemViewModelV1Body>>();
  
  songsData?.map((song)=>{
    song.attributes?.tags?.data.map((tag)=>presentTags.add(tag))
  })

  
  
  const calculateDuration = (songsData:DataObject<ISongListItemViewModelV1Body>[]) => {
    if (!songsData || !songsData.length) return 0;
    const seconds = songsData.reduce((total:number,song: DataObject<ISongListItemViewModelV1Body>)=>{
      return total + song.attributes.Duration;
    },0);
    let minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    minutes = minutes - hours*60;
    
    return `${hours>1 ? Math.floor(hours)+'h ' : ''}${minutes>1?Math.floor(minutes)+'m ':''}`
    
    
  }
    
  useEffect(()=>{
    if(title)
      navigation.setOptions({title:title});
  },[title,navigation])
    
  return (

            <FlatList 
            ListHeaderComponent={()=>   <Flex>
              <Surface>
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
                        justifyContent: 'center',
                        overscrollBehaviorX: 'auto'
                      }}
                      ph={24}
                    >
                      <TagGroup tagsData={[...presentTags]}/>
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

              </VStack>
              </Surface>
            </Flex>}
            stickyHeaderIndices={[0]}
            
            contentContainerStyle={{ flexGrow: 1 }}
            style={{ flex: 1 }} 
            data={songsData} 
            renderItem={({item})=><SongListItem data={item}/>}/> 
  )
}

export default Route