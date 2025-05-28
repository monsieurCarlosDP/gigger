import { ThemedText } from "@/components/ThemedText";
import { useEventService } from "@/hooks/events/events";
import { convert2dateFormat, convert2timeFormat } from "@/src/utils/date";
import { Box, Flex, HStack, Surface, VStack } from "@react-native-material/core";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native"
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

type TSeachParams = {
  
    event: string;
  
}


const Route = () => {

    const { event } = useLocalSearchParams<TSeachParams>();

    const { eventData } = useEventService(event);
    const {data,meta} = eventData ?? {};
    const { attributes } = data ?? {}
    const { Title, Date: eventDateRaw, Private, Time } = attributes ?? {}
    const navigation = useNavigation();

      useEffect(()=>{
          navigation.setOptions({title:Title});
      },[Title,navigation])
      const eventDate = new Date(eventDateRaw?? '');
      const formattedDate = convert2dateFormat(eventDate);

return (<View>
    <Flex>
        <VStack p={24} spacing={12}>
            <HStack>
               <Surface
                elevation={3}
                category="medium"
                style={{width: '100%', flexGrow: 1}}
               >
                <Box m={24}>
                    <ThemedText type='title2'>{Private?<Feather name="lock" size={24} color="black" />:<Feather name="unlock" size={24} color="black" />} {Title}</ThemedText>
                </Box>
                </Surface> 
            </HStack>
            <HStack spacing={12}>
               <Surface
                elevation={3}
                category="medium"
                style={{width: '50%', flexGrow: 1, justifyContent:'center', alignItems: 'center'}}
                
               >
                    <ThemedText type='subtitle2'>{formattedDate}</ThemedText>
                </Surface> 
               <Surface
                elevation={3}
                category="medium"
                style={{width: '30%', flexGrow: 1, alignItems: 'center'}}
               >
                <Box m={24} style={{display: 'flex', gap: 4, flexDirection: 'row'}}>
                    <FontAwesome6 name="clock" size={24} color="black" /><ThemedText type='subtitle'>{convert2timeFormat(Time ?? '')}</ThemedText>
                </Box>
                </Surface> 
            </HStack>

        </VStack>
    </Flex>
</View>)
}

export default Route