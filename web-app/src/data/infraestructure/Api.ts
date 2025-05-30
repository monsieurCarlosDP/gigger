import { type GenericResponse, type ISetlistListItemViewModelV1Body, type IDashboardItemViewModelV1Body, type ISongListItemViewModelV1Body } from "../api-client/data-contracts";
import { HttpClient } from "../api-client/http-client";

export class Api<TData = unknown> {
    http: HttpClient<TData>;
    constructor(http: HttpClient<TData>) {
        this.http = http;
}

      //#region SONGS
        async getSongs() {
            return this.http.get<GenericResponse<ISongListItemViewModelV1Body>>('/songs');
        }

        async getSong(id: string) {
            return this.http.get<ISongListItemViewModelV1Body>(`/songs/${id}`);
        }
      //#endregion

      //#region SETLISTS

      async getSetlists(){
        return this.http.get<GenericResponse<ISetlistListItemViewModelV1Body>>(`/setlists`);
      }

      async getSetlist(id: string){
        return this.http.get<ISetlistListItemViewModelV1Body>(`/setlists/${id}`);
      }
      //#endregion

      //#region DASHBOARD

      async getDashboard(){
        return this.http.get<IDashboardItemViewModelV1Body>(`/base-dashboard`);
      }

      //#endregion

}