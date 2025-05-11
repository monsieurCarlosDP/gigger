import { BaseService } from "../base-service";
import { IApiClient } from "../../data/Api";
import { ILoginData } from "@/src/data/data-contracts";
import { ILoginResponseDTO } from "./interface-auth-service-dto";

export interface IAuthService {
    logIn: (data:ILoginData) => Promise<ILoginResponseDTO>
}

export class AuthService extends BaseService implements IAuthService {
    constructor (apiClient: IApiClient){
        super(apiClient)
    }

    logIn = (data:ILoginData): Promise<ILoginResponseDTO> => {
        return this.apiClient.logIn(data);
    }

}