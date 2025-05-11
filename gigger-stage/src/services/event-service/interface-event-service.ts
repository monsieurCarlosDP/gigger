import { ListResponse, SimpleResponse, IEventViewModelV1Body } from "@/src/data/data-contracts";

export interface IEventListDTO extends ListResponse<IEventViewModelV1Body> {}

export interface IEventDTO extends SimpleResponse<IEventViewModelV1Body> {}