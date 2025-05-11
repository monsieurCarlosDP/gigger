import { Image, StyleSheet, Platform } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import React, { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { useEventService } from '@/hooks/events/events';
import { Flex, HStack, ListItem, Pressable, Stack, Surface, VStack } from '@react-native-material/core';
import { ThemedText } from '@/components/ThemedText';
import { IEventListDTO } from '@/src/services/event-service/interface-event-service';
import Status from '@/components/atoms/Status';




export default function HomeScreen() {
  const router = useRouter();
  

  
  const { isLoadingEvents, eventsData, eventsError } = useEventService();

  const calculateNextEvent = (events: IEventListDTO | undefined) => {
    const today = new Date();
    return events?.data.find(event=>{
      if(event.attributes.Date)      
        return new Date(event?.attributes?.Date) > today
      })
    }

    const nextEvent = useRef(calculateNextEvent(eventsData))


  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      
      headerImage={
        <Image
          source={require('@/assets/images/events.png')}
          style={styles.img}
        />
      }> 
        <HStack p={12}>
          <Flex fill>
            <Surface elevation={3}>
            <Pressable pressEffect='highlight' >
              <Stack ph={10} spacing={5}>
                <HStack items='center' spacing={4}>
                  <ThemedText type='subtitle2'>Próximo evento</ThemedText>
                  <Status size={20} status={'disconnected'}/>
                </HStack>
                <HStack items='center' justify='between' >
                  <ThemedText type='title2'>{nextEvent.current?.attributes.Title}</ThemedText>
                  <VStack items='end'>
                    <ThemedText type='subtitle2'>{nextEvent.current?.attributes.Date?.toString()}</ThemedText>
                    <ThemedText type='subtitle2'>{nextEvent.current?.attributes.Type}</ThemedText>
                  </VStack>
                </HStack>
                <HStack>
                </HStack>
              </Stack>
            </Pressable>
            </Surface>
          </Flex>
        </HStack>
        {
          eventsData && Array.isArray(eventsData.data) && eventsData?.data.map((data,index)=>{
            return <ListItem key={index} title={data?.attributes?.Date?.toString()} />
          })
        }
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  img: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    
  },
});
