import { ISongListItemDTO, ISongItemDTO } from "./ISongServicesDTO";

export interface ISongServices {
    getSongs: () => Promise<ISongListItemDTO>;
    getSong: (id: string) => Promise<ISongItemDTO>;
}