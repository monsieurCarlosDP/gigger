import { getItemAsync, setItemAsync } from "expo-secure-store";

export class StorageClient {

    public getValue = async (key:string):Promise<string|null> => {
    return await getItemAsync(key)
    }

    public setValue = async<TData>(key:string,value:TData) =>{
    const data = JSON.stringify(value);
    return await setItemAsync(key,data);
    }
}



