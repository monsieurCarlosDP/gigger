import { DataObject, ISetlistListItemViewModelV1Body, ISongListItemViewModelV1Body, SimpleCollection } from '@/src/data/data-contracts'
import React from 'react'
import { ThemedText } from '../ThemedText'
import { ListItem } from '@react-native-material/core'
import SongListItem from './SongListItem'

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

    data?.map((song,index)=>
        
            <SongListItem key={song.id} data={song}/>

        
    )    
  )
}

export default SongList