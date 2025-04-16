"use client"
import { styled } from '@mui/material'
import React from 'react'

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
  return (
    <Main>{children}</Main>
  )
}
