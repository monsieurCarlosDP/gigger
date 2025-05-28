import { DataObject, ISetlistListItemViewModelV1Body } from '@/src/data/data-contracts'
import { ISetlistItemDTO } from '@/src/services/setlist-service/interface-setlist-service'
import { ListItem, ListItemProps } from '@react-native-material/core'
import { Link, router } from 'expo-router'
import React from 'react'

export interface SetlistListItemProps extends ListItemProps {
  data: DataObject<ISetlistListItemViewModelV1Body>
}
const SetlistListItem = ({
  data
}: SetlistListItemProps) => {
  const { attributes } = data;
  const { Name: title} = attributes;
  console.log(title)
  return (
    <Link href={`/setlistDetail/${data.id}`} asChild>
      <ListItem 
      pressEffect='ripple'
      title={title}
      pressEffectColor='red'
      />
    </Link>
  )
}

export default SetlistListItem