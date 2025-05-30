import { BaseService } from "../base-service/base-service";
import {type ISetlistServices } from "./ISetlistServices";
import {type IGiggerApiClient } from "../../data/infraestructure/IGiggerApiClient";

export class SetlistService extends BaseService implements ISetlistServices {
    constructor(apliClient: IGiggerApiClient){
        super(apliClient);
    }

    getSetlists = async() => {
        return this.apiClient.getSetlists();
    }

    getSetlist = async (id: string) => {
        return this.apiClient.getSetlist(id);
    }

}