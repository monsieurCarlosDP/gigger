import { useAuth } from '@/hooks/auth/auth'
import { Box, Flex, TextInput, VStack } from '@react-native-material/core'
import React, { useReducer, useRef, useState } from 'react'
import { Button, NativeSyntheticEvent, TextInputChangeEventData, View } from 'react-native'

type Props = {}

const LoginPage = (props: Props) => {

    const [userName,setUserName] = useState<string|null>(null);
    const [passWord,setPassWord] = useState<string|null>(null);
    const {logIn} = useAuth();

    let inputTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

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
        <View>
            <Flex>
                <VStack p={12}>
                    <TextInput data-id='username' onChangeText={text => handleChange('username', text)} label='Usuario'/>
                    <TextInput data-id='password' onChangeText={text => handleChange('password', text)} secureTextEntry={true} label='Password'/>
                </VStack>
                <Box p={12}>
                    <Button onPress={handleLogIn} color='#ff00ff'  title='Log In'/>    
                </Box>
            </Flex>
        </View>
    )
}

export default LoginPage