import { StorageClient } from "./storage-client";

export interface IStorageApi<TData = unknown> extends StorageApi<TData> {}

export class StorageApi<TData = unknown>{
    storage: StorageClient;
    constructor(storage: StorageClient){
        this.storage = storage;
    }

    async getUser() {
        return this.storage.getValue('user');
    }

    async setUser(data:TData) {
        const value = JSON.stringify(data);
        return this.storage.setValue('user',value)
    }

}