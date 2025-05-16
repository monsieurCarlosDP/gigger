import { StorageClient } from "./storage-client";

export interface IStorageApi<TData = unknown> extends StorageApi<TData> {}

export class StorageApi<TData = unknown>{
    storage: StorageClient;
    constructor(storage: StorageClient){
        this.storage = storage;
    }

    async getUser() {
        const value = await this.storage.getValue('user')
        return JSON.parse(value ?? '');
    }

    async setUser<TData>(data:TData) {
        const value = JSON.stringify(data);
        return this.storage.setValue('user',value)
    }

}