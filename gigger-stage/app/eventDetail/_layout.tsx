import { Stack } from "expo-router"

export const _layout = () => {
    return (<Stack>
            <Stack.Screen name="[event]" options={{title: 'event detail view'}} />
        </Stack>)
}