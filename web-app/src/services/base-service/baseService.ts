import { HttpClient } from "@/data/api-client/http-client";


export interface IHttpClient<SecurityDataType = unknown> extends Api<SecurityDataType> {}