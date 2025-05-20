import { useAuth } from '@/hooks/auth/auth'
import { Box, Flex, TextInput, VStack } from '@react-native-material/core'
import React, { useEffect, useRef, useState } from 'react'
import { Button, View, Text, StyleSheet } from 'react-native'
import Input from '../ui/atoms/Input'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useAuthContext } from '@/src/context/auth-context'

type Props = {}

const LoginPage = (props: Props) => {

    const [userName,setUserName] = useState<string|null>(null);
    const [passWord,setPassWord] = useState<string|null>(null);
    const router = useRouter();
    const {logIn, user} = useAuthContext();

    let inputTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);


    useEffect(()=>{
        if(user)
            router.navigate('/(tabs)');
    },[user,router])

    const handleChange = (field: 'username' | 'password', text:string) => {
        if(inputTimeout.current)
            clearTimeout(inputTimeout.current)

        inputTimeout.current = setTimeout(()=>{
            if (field === 'username') setUserName(text)
            else setPassWord(text)

        },500);

    }

    const handleLogIn = () => {

    if(userName && passWord)
    {
        logIn({
            identifier: userName,
            password: passWord
        })
    }
    }


return (
   <SafeAreaView>
            <View style={styles.content}>
            <Flex>
                <VStack p={12}>
                    <Input label={<Text>Usuario</Text>} onChange={text => handleChange('username', text)} placeHolderText='Usuario'/>
                    <Input label={<Text>Password</Text>} onChange={text => handleChange('password', text)} placeHolderText='Contraseña' isPassword />
                </VStack>
                <Box p={12}>
                    <Button onPress={handleLogIn} color='#ff00ff'  title='Log In'/>    
                </Box>
            </Flex>
            </View>
    </SafeAreaView>
    )
}

const styles = StyleSheet.create({

    content: {
    }

})

export default LoginPage