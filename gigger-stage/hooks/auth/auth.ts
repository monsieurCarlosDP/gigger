import { useQuery } from "@tanstack/react-query";
import { authQueryKeysFactory } from "./authQueryKeysFactory";
import { useServiceContext } from "@/src/context/service-context";
import { ILoginData } from "@/src/data/data-contracts";

const logIn = (data:ILoginData) => {
    const { authService } = useServiceContext();

    const {
        isLoading: isLoadingLogin,
        isError: isErrorLogin,
        data: dataLogin,
        error: errorLogin
    } = useQuery(authQueryKeysFactory.logIn(authService, data))

    return { 
        isErrorLogin,
        isLoadingLogin,
        dataLogin,
        errorLogin
    }

}

export const useAuth = () => {

    return {
        logIn
    }
}