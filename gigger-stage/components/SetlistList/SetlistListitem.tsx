import { ListItem, ListItemProps, Pressable } from '@react-native-material/core'
import React from 'react'

export interface SetlistListItemProps extends ListItemProps {

}

const SetlistListItem = ({
  title,
  secondaryText
}: SetlistListItemProps) => {
  return (
    
      <ListItem 
        pressEffect='ripple'
        title={title}
        pressEffectColor='red'
      />
  )
}

export default SetlistListItem