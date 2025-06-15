import { ILoginResponseDTO } from "../services/auth-service/interface-auth-service-dto";
import { SimpleResponse, ListResponse, IDashboardItemViewModelV1Body, ISetlistListItemViewModelV1Body, ISongListItemViewModelV1Body, IEventViewModelV1Body, ILoginData } from "./data-contracts";
import { HttpClient } from "./http-client";



export interface IApiClient<TData=unknown> extends Api<TData> {
    
}
export class Api<TData= unknown>{
    http: HttpClient<TData>;
    constructor(http: HttpClient<TData>){
        this.http = http;
    }

    //#region SONGS

    async getSongs() {
        return this.http.get<ListResponse<ISongListItemViewModelV1Body>>('/songs');
    }

    async getSong(id: string) {
        return this.http.get<SimpleResponse<ISongListItemViewModelV1Body>>(`/songs/${id}`);
    }
    //#endregion

    //#region SETLISTS

    async getSetlists(){
        return this.http.get<ListResponse<ISetlistListItemViewModelV1Body>>('/setlists');
    }

    async getSetlist(id: string){
        return this.http.get<SimpleResponse<ISetlistListItemViewModelV1Body>>(`/setlists/${id}?populate[songs][populate]=tags,song_resources`);
      }
    //#endregion

    //#region DASHBOARD
    async getDashboard(){
        return this.http.get<IDashboardItemViewModelV1Body>(`/base-dashboard`);
      }
    //#

    //#region EVENTS
    
      async getEvents(){
        return this.http.get<ListResponse<IEventViewModelV1Body>>('/events?sort=Date:ASC')
      }
      async getEvent(id:string){
        return this.http.get<SimpleResponse<IEventViewModelV1Body>>('/events/'+id)
      }
    
    //#

    //#region AUTH
    
      async registerUser(){

      }

      async logIn(data:ILoginData){
        return this.http.post<ILoginData,ILoginResponseDTO>('/auth/local',data);
      }
    
    //#

}