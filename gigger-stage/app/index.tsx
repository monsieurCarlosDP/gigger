import LoginPage from '@/components/pages/LoginPage';
import { useAuth } from '@/hooks/auth/auth';
import { Redirect } from 'expo-router';
import React, { useEffect } from 'react'
import { View } from 'react-native';

type Props = {}

const index = (props: Props) => {

  return (
    <View>
        <LoginPage />
    </View>
  )
}

export default index