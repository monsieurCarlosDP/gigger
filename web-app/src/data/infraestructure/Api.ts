import { ContentType, HttpClient } from "../api-client/http-client";

export class Api<TData = unknown> {
    http: HttpClient<TData>;
    constructor(http: HttpClient<TData>) {
        this.http = http;
      }

      //#region SONGS
        async getSongs() {
            return this.http.get('/songs');
        }
      //#endregion

}