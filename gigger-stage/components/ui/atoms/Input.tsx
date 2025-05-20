import React from 'react'
import { StyleSheet, Text, View, TextInput, TouchableHighlight, TextInputChangeEventData } from 'react-native'
import { transform } from '@babel/core'
import AntDesign from '@expo/vector-icons/AntDesign';
type Props = {
  label?: React.ReactNode,
  icon?: React.ReactNode,
  isPassword?:boolean,
  value?: string|undefined,
  onChange?: (e: string)=>void
  placeHolderText?: string|undefined
}

const Input = ({
  label=<Text>Demo Label</Text>, 
  icon= <AntDesign name="user" size={24} color="black" />,
  isPassword= false,
  placeHolderText= 'This is where your placeholder text is',
  value,
  onChange
}: Props) => {
  return (
    <View style={styles.textInputContainer}>
      <View style={styles.textInputLabel}>{label}</View>
      <TouchableHighlight>
        <View style={styles.textInputInnerContainer}>
          {icon && <View>{icon}</View>}
          <TextInput style={styles.textInput} onChangeText={onChange} value={value} placeholder={placeHolderText} secureTextEntry={isPassword} autoCapitalize='none'/>
        </View>
      </TouchableHighlight>
   </View>
  )
}

const styles = StyleSheet.create({
  textInputContainer: {
    gap: 4,
    margin: 4,
    overflow: 'hidden',
  },
  textInputInnerContainer: {
    borderWidth: 1,
    borderRadius: 5,
    gap:4,
    paddingVertical: 12,
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'


  },
  textInput: {
    overflow: 'hidden',
    flexGrow: 1
  },

  textInputLabel: {
    paddingLeft: 8
  }

})

export default Input 