import { type ISetlistItemDTO, type ISetlistListItemDTO } from "./ISetlistServiceDTO";

export interface ISetlistServices {
    getSetlists: ()=>Promise<ISetlistListItemDTO>;
    getSetlist: (id:string)=>Promise<ISetlistItemDTO>;
}