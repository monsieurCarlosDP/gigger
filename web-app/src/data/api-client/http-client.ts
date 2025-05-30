
export enum ContentType {
    Json = 'application/json',
    FormData = 'multipart/form-data',
    UrlEncoded = 'application/x-www-form-urlencoded',
    Text = 'text/plain',
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class HttpClient<TData = unknown> {
    private baseURL: string;
    private getHeaders: () => Record<string, string>;
    constructor() {
        this.baseURL = `${import.meta.env.NEXT_PUBLIC_PROTOCOL}${import.meta.env.NEXT_PUBLIC_HOST}/api`;
        this.getHeaders = () => ({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.NEXT_PUBLIC_STRAPI_API_KEY}`
            });        
    };

    public get = async<TData>(url: string): Promise<TData> => {
        const response = await fetch(`${this.baseURL}${url}`,
            {
                method: 'GET',
                headers: this.getHeaders()
            }
        );
        return response.json();
    }
}