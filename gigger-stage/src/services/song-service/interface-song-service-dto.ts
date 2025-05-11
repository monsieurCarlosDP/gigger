import { ListResponse, SimpleResponse, ISongListItemViewModelV1Body } from "@/src/data/data-contracts";


// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ISongListItemDTO extends ListResponse<ISongListItemViewModelV1Body> {
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ISongItemDTO extends SimpleResponse<ISongListItemViewModelV1Body> {

}