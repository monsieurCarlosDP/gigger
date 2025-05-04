import { Image, StyleSheet, Platform } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView'
import React, { useState } from 'react'
import { Box, even, HStack, Surface, VStack, Pressable } from '@react-native-material/core';
import { ThemedText } from '@/components/ThemedText';
import { useDashboardService } from '@/hooks/dashboard/dashboard';

type Props = {}

const index = (props: Props) => {
    
    const user = 'Usuario';const {
        isLoadingDashboard,
        dashboardData
    } = useDashboardService();

    const { events, eventList } = dashboardData ?? {};
    const [nextEvent, setNextEvent] = useState(()=>{
        if(eventList){
            return eventList[0]}
        else
            {return {}}
        }
    );
    
    
  return (
    <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        
        headerImage={
        <Image
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.reactLogo}
        />
        }
        
        >

            <VStack p={12} spacing={12}>
                <Box>
                    <ThemedText type='title'>Bienvenid@, {user}</ThemedText>
                    <ThemedText type='subtitle'>Tienes {events} eventos programados</ThemedText>
                </Box>
                    <Box>
                        <Surface elevation={2}
                            style={{
                                padding:12
                            }}>
                            {nextEvent && <>
                                <ThemedText type='subtitle2'>Próximo evento:</ThemedText>
                                <ThemedText type='title'>{nextEvent?.Title}</ThemedText>
                                <ThemedText type='subtitle'>{nextEvent?.Date?.toString()}</ThemedText>
                            </>}
                        </Surface>
                    </Box>
            </VStack>


        </ParallaxScrollView>   
  )
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
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});


export default index