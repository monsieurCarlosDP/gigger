import { IApiClient } from "@/src/data/Api";
import { BaseService } from "../base-service";
import { ISetlistItemDTO, ISetlistsListItemDTO } from "./interface-setlist-service";


export interface ISetlistService {
    getSetlists: ()=>Promise<ISetlistsListItemDTO>
    getSetlist: (id: string) => Promise<ISetlistItemDTO>
}

export class SetlistService extends BaseService {
    constructor(apiClient: IApiClient){
        super(apiClient);
    }

    getSetlists = async () => {
        return this.apiClient.getSetlists();
    }

    getSetlist = async (id:string):Promise<ISetlistItemDTO> => {
        return this.apiClient.getSetlist(id);
    }
}