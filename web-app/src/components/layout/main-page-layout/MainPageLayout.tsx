"use client"
import { EventAvailable, MusicNote, PlaylistAdd } from '@mui/icons-material'
import { SpeedDial, SpeedDialAction, SpeedDialIcon, Drawer, styled } from '@mui/material'
import React, { useState } from 'react'

interface MainPageLayoutProps {
    children: React.ReactNode
}

const Main = styled('main')(()=> ({
    display: 'flex',
    flexDirection: 'column',
    flex:1,
    height: '100vh'
}))


export const MainPageLayout = ({children}: MainPageLayoutProps) => {

  const [showDrawer,setShowDrawer] = useState<boolean>(false)

  return (
    <Main>
      {children}    
    <Drawer
      anchor='right'
      open={showDrawer}
      onClose={()=>setShowDrawer(false)}
    >
      AAA</Drawer>
    <SpeedDial
              ariaLabel="SpeedDial basic example"
              FabProps={{
                color: 'primary'
              }}
              sx={{ 
                position: 'absolute', 
                bottom: 16, 
                right: 16 }}              
              icon={<SpeedDialIcon />}
            >
              <SpeedDialAction 
                onClick={()=>console.log("lalalla")}
                key='add new song'
                title='Add new song'
                icon={<MusicNote />}
              />
              <SpeedDialAction 
                onClick={()=>console.log("lalalla")}
                key='create new playlist'
                title='Create new playlist'
                icon={<PlaylistAdd />}
              />
              <SpeedDialAction 
                onClick={()=>{
                    setShowDrawer(()=>true)
                } 
                }
                key='add new eventt'
                title='Add new event to calendar'
                icon={<EventAvailable />}
              />
                
            </SpeedDial>
    </Main>
  )
}
