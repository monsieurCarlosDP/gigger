import { useMutation, useQuery } from "@tanstack/react-query";
import { authQueryKeysFactory } from "./authQueryKeysFactory";
import { useServiceContext } from "@/src/context/service-context";
import { ILoginData } from "@/src/data/data-contracts";
import { useCallback, useEffect, useState } from "react";
import { ILoginResponseDTO } from "@/src/services/auth-service/interface-auth-service-dto";


export const useAuth = () => {
    const { authService } = useServiceContext();
    
        const loginMutation =  useMutation<
        ILoginResponseDTO,
        Error,
        ILoginData
        >({
            mutationKey: ['login'],
            mutationFn: (data)=>authService.logIn(data)
    
        });
    
         const logIn = useCallback((data:ILoginData) => {
            return loginMutation.mutate(data)
         },[loginMutation])

        console.log(loginMutation)
    
    const user ={}

    // Replantear toda la funcion, capullo

    return {
        logIn,
        user
    }
}