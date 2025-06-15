import { DataObject, ISetlistListItemViewModelV1Body, ISongListItemViewModelV1Body, SimpleCollection } from '@/src/data/data-contracts'
import React from 'react'
import SongListItem from './SongListItem'
import { FlatList } from 'react-native'

type Props = {
    songs: ISetlistListItemViewModelV1Body['songs']
}

const SongList = ({songs}: Props) => {

    const { data } = songs ?? {};
    
function isSongArray(song: DataObject<ISongListItemViewModelV1Body> | DataObject<ISongListItemViewModelV1Body>[]): 
    song is DataObject<ISongListItemViewModelV1Body>[] {
    return Array.isArray(song);
  }

  if(!data)
    return <></>

  return (    
    <FlatList 
      contentContainerStyle={{ flexGrow: 1 }}
      style={{ flex: 1 }} 
      data={data} 
      renderItem={({item})=><SongListItem data={item}/>}/>
    
  )
}

export default SongList