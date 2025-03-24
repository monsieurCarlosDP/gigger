import { HttpClient } from "../api-client/http-client";
import { Api } from "./Api";

import { IGiggerApiClient } from "./IGiggerApiClient";
import { IHttpClient } from "../api-client/IHttpClient";

export class GiggerApiClient<SecurityDataType = unknown>
  extends Api<SecurityDataType>
  implements IGiggerApiClient<SecurityDataType>
{
  constructor(http: IHttpClient<SecurityDataType>) {
    super(http as HttpClient<SecurityDataType>);
  }
}
