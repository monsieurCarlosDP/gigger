import { type IGiggerApiClient } from "../../data/infraestructure/IGiggerApiClient";
import { type ISongServices } from "./ISongServices";
import { BaseService } from "../base-service/base-service";
export class SongService extends BaseService implements ISongServices {
    constructor(apiClient: IGiggerApiClient) {
        super(apiClient);

    }
    
    getSongs = async () => {
        return this.apiClient.getSongs();
    }

    getSong = async (id: string) => {
        return this.apiClient.getSong(id);
    }
}