import { GenericResponse, ISetlistListItemViewModelV1Body } from "@/src/data/data-contracts";


// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ISetlistsListItemDTO extends GenericResponse<ISetlistListItemViewModelV1Body> {
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ISetlistItemDTO extends ISetlistListItemViewModelV1Body {

}