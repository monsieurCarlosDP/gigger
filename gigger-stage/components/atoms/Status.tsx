import React, { useState } from 'react'
import { IconSymbol, IIconSymbol } from '../ui/IconSymbol'

export type IStatus = 'connected' | 'connecting' | 'disconnected';

type Props = {
    status: IStatus
} & Partial<IIconSymbol>

const statusColor = (status: IStatus) => {

    switch(status) {
        case 'connected':
            return '#00BB00'
        case 'connecting':
            return '#FFFD00'
        case 'disconnected':
            return '#FF0066'

    }

}

const Status = ({
    size=32,
    status = 'disconnected'
}: Props) => {

    


  return (
    <IconSymbol name='circle.fill' size={size} color={statusColor(status)}/>
  )
}

export default Status