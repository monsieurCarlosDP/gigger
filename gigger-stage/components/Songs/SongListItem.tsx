import { DataObject, ISetlistListItemViewModelV1Body, ISongListItemViewModelV1Body } from '@/src/data/data-contracts'
import { ISetlistItemDTO } from '@/src/services/setlist-service/interface-setlist-service'
import { Avatar, Box, HStack, ListItem, ListItemProps } from '@react-native-material/core'
import { Link, router } from 'expo-router'
import React from 'react'
import { ThemedText } from '../ThemedText'
import { View } from 'react-native'
import { Surface } from 'react-native-paper'

export interface SongListItemProps extends ListItemProps {
  data: DataObject<ISongListItemViewModelV1Body>
}

const SongListItem = ({
  data
}: SongListItemProps) => {
  const { attributes } = data;
  const { Title: title, Tags: tagsObject} = attributes ?? {};
  const { data: tagsData } = tagsObject ?? {}
  return (
    <HStack> 
        <Surface style={{flexGrow:1}}>
            <Box 
                h={36} 
                ph={12} 
                style={{
                    justifyContent: 'center'
                }}>
                    <ThemedText type='default'>{title}</ThemedText>
            </Box>
        </Surface>
    

    </HStack>
  )
}

export default SongListItem