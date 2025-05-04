import { DataObject, ITagsItemViewModelV1Body } from '@/src/data/data-contracts'
import { Avatar, AvatarProps } from '@react-native-material/core'
import React from 'react'
import { ThemedText } from '../ThemedText'

type TagProps = AvatarProps & {
    tagData: DataObject<ITagsItemViewModelV1Body> | undefined ,
    size?: number
}

const Tag = ({tagData, size=32}: TagProps) => {
  return (
    <Avatar size={size} color={tagData?.attributes.Color} label={
        <Avatar size={24} color='black' label={<ThemedText type='tagAvatar' >{tagData?.attributes.Icon}</ThemedText>}/>
        }/>
  )
}

export default Tag