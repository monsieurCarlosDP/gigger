import { useMutation } from "@tanstack/react-query";
import { useServiceContext } from "@/src/context/service-context";
import { ILoginData } from "@/src/data/data-contracts";
import { useCallback, useEffect, useState } from "react";
import { ILoginErrorResponseDTO, ILoginResponseDTO, IUserData } from "@/src/services/auth-service/interface-auth-service-dto";
import { useStorage } from "../secure-storage/storage";
import { useRouter } from "expo-router";

const isLoginError = (data: any): data is ILoginErrorResponseDTO => {
  return data && 'data' in data && 'error' in data;
};


export const useAuth = () => {
    const { getValue, setValue, clearValue } = useStorage();
    const [user,setUser] = useState<IUserData|undefined>(undefined);
    const { authService } = useServiceContext();

    useEffect(()=>{

        const loadUser = async () => {
            const storedValue = await getValue('user');
            if(storedValue)
                setUser(JSON.parse(storedValue).user)
        }
        loadUser();

    },[]);


    
    const loginMutation =  useMutation<
        ILoginResponseDTO | ILoginErrorResponseDTO,
        Error,
        ILoginData
        >({
            mutationKey: ['login'],
            mutationFn: (data)=>{
                const response = authService.logIn(data);
            if (isLoginError(response)) {
                throw new Error(response.error.message || 'Login failed');
            }
      
      return response;
            },
            onSuccess: (data)=> {

                if(isLoginError(data)){
                    console.error(data.error.message)
                    return
                }
                        
                setValue('user',data);
                setUser(data.user);
            
            }
    
        });
    
         const logIn = useCallback((data:ILoginData) => {
            return loginMutation.mutate(data)
         },[loginMutation])

         const logOut = ()=>{
            setUser(undefined);
            clearValue('user');
            
         }
        
    return {
        logIn,
        logOut,
        user
    }
}