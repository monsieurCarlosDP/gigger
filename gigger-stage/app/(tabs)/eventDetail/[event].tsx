import { useEventService } from "@/hooks/events/events";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { View } from "react-native"

type TSeachParams = {
  
    event: string;
  
}


const Route = () => {

    const { event } = useLocalSearchParams<TSeachParams>();

    const { eventsData } = useEventService()

    const navigation = useNavigation();
<View>
    
</View>
}

export default Route