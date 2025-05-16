import { useAuth } from '@/hooks/auth/auth'
import { Redirect, Slot, Stack } from 'expo-router'
import React from 'react'

type Props = {}

const MainLayout = (props: Props) => {

  const {user} = useAuth();

  if(!user) return <Redirect href="./login"/>
  if(user) return <Redirect href="./(tabs)" />
  
  return (
    <Slot/>
  )
}

export default MainLayout