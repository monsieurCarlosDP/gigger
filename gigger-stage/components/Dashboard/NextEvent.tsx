import { Pressable, PressableProps, Surface } from '@react-native-material/core'
import React from 'react'
import { ThemedText } from '../ThemedText';

type Props = PressableProps & {
    title: string;
    date: string;
}

const NextEvent = ({title,date}: Props) => {
  return (
    <Surface elevation={2}>
        <Pressable
        pressEffect='ripple'
        style={{
            padding:12,
            
        }}
        >
            <ThemedText type='subtitle2'>Próximo evento:</ThemedText>
            <ThemedText type='title'>{title}</ThemedText>
            <ThemedText type='subtitle'>{date}</ThemedText>      
        </Pressable>
   </Surface>
  )
}

export default NextEvent