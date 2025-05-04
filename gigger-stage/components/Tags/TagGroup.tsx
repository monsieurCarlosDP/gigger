
import React from 'react'
import Tag from './Tag'
import { Stack, StackProps } from '@react-native-material/core'
import { DataObject, ITagsItemViewModelV1Body, SimpleCollection } from '@/src/data/data-contracts'

type TagGroupProps = StackProps & {
    tagsData: DataObject<ITagsItemViewModelV1Body>[]
}

const TagGroup = ({
    tagsData = [],
    direction= 'row'
}: TagGroupProps) => <Stack direction={direction} >
            {tagsData.map((tagData, index)=><Tag style={{
                marginLeft: -20
            }} key={index} tagData={tagData}/>)}
        </Stack>

export default TagGroup