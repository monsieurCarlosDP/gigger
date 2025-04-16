"use client"
import { HomeOutlined, LibraryMusicOutlined, FormatListBulletedOutlined, CalendarMonthOutlined, SettingsOutlined } from '@mui/icons-material'

import { Stack, styled } from '@mui/material'
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
  return (
    <NavBarStyled>
        <Stack 
            height={'50%'}
            component="ul"
            gap={2}
            flex={'col'}
            justifyContent={'space-around'}>            
            <HomeOutlined fontSize='large'/>
            <LibraryMusicOutlined fontSize='large'/>
            <FormatListBulletedOutlined fontSize='large'/>
            <CalendarMonthOutlined fontSize='large'/>
        </Stack>
        <Stack 
            component="ul"
            flex='col'
            height='50%'
            justifyContent='end'
            gap="ul">
            <SettingsOutlined fontSize='large'/>
        </Stack>
    </NavBarStyled>
  )
}

export default NavBar