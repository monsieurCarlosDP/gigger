import { HttpClient } from "./http-client";

type PublicMembers<T> = {
  [K in keyof T]: K;
}[keyof T];

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IHttpClient<SecurityDataType>
  extends Pick<HttpClient<SecurityDataType>, PublicMembers<HttpClient<SecurityDataType>>> {}
