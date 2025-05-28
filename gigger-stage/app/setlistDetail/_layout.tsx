import { Stack } from "expo-router"

export const _layout = () => {
    return (<Stack>
            <Stack.Screen name="[setlist]" options={{title: 'setlist detail view'}} />
        </Stack>)
}