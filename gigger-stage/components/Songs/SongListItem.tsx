import { DataObject, ISetlistListItemViewModelV1Body, ISongListItemViewModelV1Body } from '@/src/data/data-contracts'
import { Box, HStack, ListItemProps } from '@react-native-material/core'
import React from 'react'
import { ThemedText } from '../ThemedText'
import TagGroup from '../Tags/TagGroup'

export interface SongListItemProps extends ListItemProps {
  data: DataObject<ISongListItemViewModelV1Body>
}

const SongListItem = ({
  data
}: SongListItemProps) => {
  const { attributes } = data;
  const { Title: title, tags: tagsObject} = attributes ?? {};
  const { data: tagsData } = tagsObject ?? {}
  console.log(tagsData);
  return (
    <HStack> 
            <Box 
            
                h={48} 
                ph={12} 
                style={{
                    justifyContent: 'center',
                    backgroundColor: 'white'
                }}>
                  <HStack justify='between' items='center'>
                      <ThemedText type='default'>{title}</ThemedText>
                      {tagsData && <TagGroup tagsData={tagsData}/>}
                  </HStack>
            </Box>
    

    </HStack>
  )
}

export default SongListItem