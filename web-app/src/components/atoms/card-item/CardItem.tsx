import { Stack } from '@mui/material'
import React from 'react'

interface CardItemProps {
    cardItemLabel?: React.ReactNode,
    cardItemContent?: React.ReactNode,
}

const CardItem = ({
    cardItemLabel,
    cardItemContent
}: CardItemProps) => {
  return (
    <Stack 
        direction='column'
        flex={1}
        padding={2}
        sx={
            {
                outline: 1,
                outlineColor: 'ActiveBorder',
                borderRadius: 2,
                boxShadow: 3
            }
        }>
        <Stack>
            {cardItemLabel}
        </Stack>
        {cardItemContent && <Stack>
            {cardItemContent}
        </Stack>}
    
    </Stack>
  )
}

export default CardItem