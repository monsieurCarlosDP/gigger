import { IApiClient } from "@/src/data/Api";
import { BaseService } from "../base-service";
import { IEventDTO, IEventListDTO } from "./interface-event-service";

export interface IEventService {
    getEvents: ()=>Promise<IEventListDTO>
    getEvent: (id:string)=>Promise<IEventDTO>
}


export class EventService extends BaseService {
    constructor(apiClient: IApiClient){
        super(apiClient);
    }

    getEvents = async ()=>{
        return this.apiClient.getEvents();
    }
    getEvent = async (id:string)=>{
        return this.apiClient.getEvent(id);
    }

    
}