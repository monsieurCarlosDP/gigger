"use client"
import { HomeOutlined, LibraryMusicOutlined, FormatListBulletedOutlined, CalendarMonthOutlined, SettingsOutlined } from '@mui/icons-material'

import { IconButton, Stack, styled } from '@mui/material'
import { useRouter } from 'next/navigation'
import React from 'react'


const NavBarStyled = styled('nav')(({theme})=> ({
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4),
    borderRight: `1px solid grey`,
    backgrond: theme.palette.background.default,
    padding: theme.spacing(2),
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(3),
    overflowY: 'auto',
    height: '100vh'
}))

const NavBar = () => {

  const router = useRouter();

  const goToRoute = (url:string) =>
    router.push(`/${url}`);


  return (
    <NavBarStyled>
        <Stack 
            height={'50%'}
            component="ul"
            gap={2}
            flex={'col'}
            justifyContent={'space-around'}>   
            <IconButton 
              onClick={()=>goToRoute('')}>
              <HomeOutlined fontSize='large'/>
            </IconButton>         
            <IconButton
              onClick={()=>goToRoute('songs')}>
              <LibraryMusicOutlined fontSize='large'/>
            </IconButton>
            <IconButton
               onClick={()=>goToRoute('setlists')}>
              <FormatListBulletedOutlined fontSize='large'/>
            </IconButton>
            <IconButton
               onClick={()=>goToRoute('events')}
              >
              <CalendarMonthOutlined fontSize='large'/>
            </IconButton>
        </Stack>
        <Stack 
            component="ul"
            flex='col'
            height='50%'
            justifyContent='end'
            gap="ul">
            <IconButton>
              <SettingsOutlined fontSize='large'/>
            </IconButton>
        </Stack>
    </NavBarStyled>
  )
}

export default NavBar