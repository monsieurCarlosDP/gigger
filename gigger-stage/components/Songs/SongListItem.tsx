import { DataObject, ISongListItemViewModelV1Body } from '@/src/data/data-contracts'
import { Box, Flex, HStack, ListItemProps } from '@react-native-material/core'
import React from 'react'
import { ThemedText } from '../ThemedText'
import TagGroup from '../Tags/TagGroup'
import { StyleSheet } from 'react-native'
export interface SongListItemProps extends ListItemProps {
  data: DataObject<ISongListItemViewModelV1Body>
}

const SongListItem = ({
  data
}: SongListItemProps) => {
  const { attributes } = data;
  const { Title: title, tags: tagsObject} = attributes ?? {};
  const { data: tagsData } = tagsObject ?? {};
  return (
    <HStack style={styles.songListItem}> 

          <ThemedText type='default'>{title}</ThemedText>
          {tagsData && <TagGroup tagsData={tagsData}/>}
 
    </HStack>
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