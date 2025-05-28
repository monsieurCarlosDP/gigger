import { IGiggerApiClient } from "../../../data/infraestructure/IGiggerApiClient";
import { ISongServices } from "./ISongServices";
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