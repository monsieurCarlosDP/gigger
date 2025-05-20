import { getItemAsync, setItemAsync } from 'expo-secure-store';





const getValue = async (key:string) => {
    return await getItemAsync(key)
}

const setValue = async<TData>(key:string,value:TData) =>{
    const data = JSON.stringify(value);
    setItemAsync(key,data);
    return
}

const clearValue = async(key:string) => {
    return await setItemAsync(key,'');
}

export const useStorage = () => {
    return { getValue, setValue, clearValue }
}