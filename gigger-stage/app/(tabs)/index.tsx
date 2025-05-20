import { Image, StyleSheet, Platform } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView'
import React, { useState } from 'react'
import { Box, even, HStack, Surface, VStack, Pressable } from '@react-native-material/core';
import { ThemedText } from '@/components/ThemedText';
import { useDashboardService } from '@/hooks/dashboard/dashboard';
import NextEvent from '@/components/Dashboard/NextEvent';
import { HelloWave } from '@/components/HelloWave';

type Props = {}

const index = (props: Props) => {
    
    const {
        isLoadingDashboard,
        dashboardData
    } = useDashboardService();

    const { events, setlists, songs, eventList } = dashboardData ?? {};

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
                    <HStack spacing={12} items='center'>
                        <ThemedText type='title'>Bienvenid@,</ThemedText><HelloWave />
                    </HStack>                    
                    <ThemedText type='subtitle'>Tienes {events} eventos programados</ThemedText>
                </Box>
                <Box>                        
                    <NextEvent title={eventList?.[0].Title ?? ''} date={eventList?.[0].Date?.toString() ?? ''}/>                    
                </Box>
                <HStack justify='between'>
                    <Box 
                        style={
                            {
                                width: '30%',
                            }
                        }
                    >
                        <Surface 
                            style={{
                                    padding: 8
                                }}
                            elevation={2}>
                            <ThemedText type='title2'>{events}</ThemedText>
                            <ThemedText type='subtitle2'>Eventos</ThemedText>
                        </Surface>
                    </Box>
                    <Box
                        style={{
                                width: '30%'
                            }}
                    >
                        <Surface 
                            style={{
                                    padding: 8
                                }}
                            elevation={2}>
                            <ThemedText type='title2'>{setlists}</ThemedText>
                            <ThemedText type='subtitle2'>Setlist</ThemedText>
                        </Surface>
                    </Box>
                    <Box
                        style={{
                                width: '30%'
                            }}
                    >
                        <Surface 
                            style={{
                                    padding: 8
                                }}    
                            elevation={2}>
                            <ThemedText type='title2'>{songs}</ThemedText>
                            <ThemedText type='subtitle2'>Canciones</ThemedText>
                        </Surface>
                    </Box>
                </HStack>
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