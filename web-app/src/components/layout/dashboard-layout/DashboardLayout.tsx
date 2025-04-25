import CardItem from '@/components/atoms/card-item/CardItem'
import { IEventLocation } from '@/data/api-client/data-contracts'
import { IEventDTO } from '@/services/event-service/IEventServiceDTO'
import { Typography } from '@mui/material'
import Stack from '@mui/material/Stack/Stack'
import React from 'react'

interface DashboardProps {
    songs: number | null | undefined,
    setlists: number | null | undefined,
    events: number | null | undefined,
    eventList: IEventDTO[] | null | undefined,
}

const DashboardLayout = ({
    songs=0,
    setlists=0,
    events=0,
    eventList= [{}]
}: DashboardProps) => {

    const defaultEvent: IEventDTO = {};
    const defaultLocation : IEventLocation = {}
    const { Title, Date: EventDate , Location } = eventList?.[0] ?? defaultEvent;
    const { address } = Location ?? defaultLocation;

  return (
    <Stack component='section'
        padding={2}
        direction='column'
        gap={2}
    >
        <Stack
            direction='row'
            gap={2}
        >
            {songs && <CardItem 
                cardItemLabel={<Typography variant='h3'>{songs}</Typography>}
                cardItemContent='Songs'
            />}
            {setlists && <CardItem 
                cardItemLabel={<Typography variant='h3'>{setlists}</Typography>}
                cardItemContent='Setlists'
            />}
            {events && <CardItem 
                cardItemLabel={<Typography variant='h3'>{events}</Typography>}
                cardItemContent='Events'
            />}
            
            </Stack>
            <Typography variant='h4'>Próximo evento</Typography>
            <Stack 
                direction='row'>
                <CardItem 
                    cardItemLabel={<Typography variant='h3'>{Title}</Typography>}
                    cardItemContent={
                        <Stack>
                            {EventDate && <Typography variant='h4'>{new Date(EventDate).toLocaleDateString()}</Typography>}
                            {address && <Typography variant='body2'>{address}</Typography>}
                        </Stack>
                    }
                />

            </Stack>
    
    </Stack>
  )
}

export default DashboardLayout