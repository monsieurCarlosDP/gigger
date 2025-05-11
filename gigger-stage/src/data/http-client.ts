export class HttpClient<TData = unknown>{
    private baseUrl: string;
    private getHeaders: () => Record<string,string>
    constructor(){
        this.baseUrl = `${process.env.EXPO_PUBLIC_PROTOCOL}${process.env.EXPO_PUBLIC_HOST}${process.env.EXPO_PUBLIC_API}`
        this.getHeaders = () => ({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.EXPO_PUBLIC_API_KEY}`
        })
    };

    public get = async<TData>(url:string): Promise<TData> => {
        const response = await fetch(`${this.baseUrl}${url}`, 
            {
                method: 'GET',
                headers: this.getHeaders()
            }
        )
        return response.json();
    }

    public post = async<TData, KData>(url:string, body: TData): Promise<KData> => {
        const response = await fetch(`${this.baseUrl}${url}`,
            {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(body)
            }
        )
        return response.json();
    }
}