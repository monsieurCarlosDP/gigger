import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { IAuthService } from "../services/auth-service/auth-service";
import { useServiceContext } from "./service-context";
import { useAuth } from "@/hooks/auth/auth";
import { ILoginErrorResponseDTO, ILoginResponseDTO, IUserData } from "../services/auth-service/interface-auth-service-dto";
import { useStorage } from "@/hooks/secure-storage/storage";
import { ILoginData } from "../data/data-contracts";
import { useMutation } from "@tanstack/react-query";

const isLoginError = (data: any): data is ILoginErrorResponseDTO => {
  return data && 'data' in data && 'error' in data;
};

const AuthContext = createContext<IAuthContexProvider|null>(null);

export interface IAuthContexProvider {
    user: IUserData|undefined;
    logIn: (data:ILoginData) => void;
    logOut: () => void;
}

export const AuthContextProvider = ({children}:{children?:React.ReactNode})=>{
    const {authService} = useServiceContext()
    const { getValue, setValue, clearValue } = useStorage();
    const [user, setUser] = useState<IUserData|undefined>(undefined);

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



    return (
        <AuthContext.Provider value={{user,logIn,logOut}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if(!context)
    {
        throw new Error('useAuthContext must be used within a AuthContextProvider');
    }
    return context;
}