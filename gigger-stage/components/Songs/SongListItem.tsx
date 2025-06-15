import { DataObject, ISongListItemViewModelV1Body } from '@/src/data/data-contracts'
import { Box, Flex, HStack, ListItemProps, VStack } from '@react-native-material/core'
import React, { useState } from 'react'
import { ThemedText } from '../ThemedText'
import TagGroup from '../Tags/TagGroup'
import { Pressable, StyleSheet, Text } from 'react-native'
export interface SongListItemProps extends ListItemProps {
  data: DataObject<ISongListItemViewModelV1Body>
}

const SongListItem = ({
  data
}: SongListItemProps) => {
  const [isExpanded,setIsExpanded] =useState<boolean>(false)
  const { attributes } = data;
  const { Title: title, tags: tagsObject , song_resources: songResources } = attributes ?? {};
  const { data: tagsData } = tagsObject ?? {};
  const { data: songResourcesData } = songResources ?? {};
  const { attributes: attributesSongResources } = songResourcesData ?? {}
  const { NombreRecurso: name } = attributesSongResources ?? {}

  return (

    <>
    <Pressable onTouchEnd={()=>setIsExpanded(!isExpanded)}>
      <HStack style={styles.songListItem}> 

            <ThemedText type='default'>{title}</ThemedText>
            {tagsData && <TagGroup tagsData={tagsData}/>}
      </HStack>

    </Pressable>
      {isExpanded && <VStack>
        <Text>{name}</Text>
      </VStack>}
  
    </>
  )
}

const styles = StyleSheet.create({
  songListItem: {
    borderColor: '#444',
    borderBottomWidth:1,
    height: 50,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})

export default SongListItem