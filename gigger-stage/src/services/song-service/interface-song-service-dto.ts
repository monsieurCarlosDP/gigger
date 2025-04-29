import { GenericResponse, ISongListItemViewModelV1Body } from "@/src/data/data-contracts";


// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ISongListItemDTO extends GenericResponse<ISongListItemViewModelV1Body> {
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ISongItemDTO extends ISongListItemViewModelV1Body {

}