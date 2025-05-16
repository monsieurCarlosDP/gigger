import { BaseService } from "../base-service";
import { IApiClient } from "../../data/Api";
import { ILoginData } from "@/src/data/data-contracts";
import { ILoginResponseDTO } from "./interface-auth-service-dto";
import { IStorageApi } from "@/src/data/storage-api";

export interface IAuthService {
    logIn: (data:ILoginData) => Promise<ILoginResponseDTO>
    getUser: ()=>Promise<ILoginResponseDTO|null>
    setUser: (data:ILoginResponseDTO)=>Promise<void>
}

export class AuthService extends BaseService implements IAuthService {
    storageClient: IStorageApi;
    constructor (apiClient: IApiClient, storageClient: IStorageApi){
        super(apiClient);
        this.storageClient = storageClient;
    }

    logIn = async (data:ILoginData): Promise<ILoginResponseDTO> => {
        return this.apiClient.logIn(data);
    }

    getUser = async ()=>{
        return this.storageClient.getUser();
    }

    setUser = async (data: ILoginResponseDTO) => {
        return this.storageClient.setUser(data);
    }

}