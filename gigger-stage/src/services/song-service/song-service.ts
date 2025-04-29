import { BaseService } from "../base-service";
import { IApiClient } from "../../data/Api";
import { ISongItemDTO, ISongListItemDTO } from "./interface-song-service-dto";

export interface ISongService {
    getSongs: ()=>Promise<ISongListItemDTO>
    getSong: (id: string) => Promise<ISongItemDTO>
}

export class SongService extends BaseService implements ISongService {
    constructor (apiClient: IApiClient){
        super(apiClient)
    }
    getSongs = async ():Promise<ISongListItemDTO> => {
        return this.apiClient.getSongs();
    }

    getSong = async (id: string) => {
        return this.apiClient.getSong(id);
    }
} 