import { ListResponse, SimpleResponse, ISetlistListItemViewModelV1Body } from "@/src/data/data-contracts";


// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ISetlistsListItemDTO extends ListResponse<ISetlistListItemViewModelV1Body> {
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ISetlistItemDTO extends SimpleResponse<ISetlistListItemViewModelV1Body> {

}