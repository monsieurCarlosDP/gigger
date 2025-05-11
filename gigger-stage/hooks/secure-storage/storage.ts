import { getItemAsync, setItemAsync } from 'expo-secure-store';





const getValue = async (key:string) => {
    return await getItemAsync(key)
}

const setValue = async<TData>(key:string,value:TData) =>{
    const data = JSON.stringify(value);
    return
}

export const useStorage = () => {
    return { getValue }
}