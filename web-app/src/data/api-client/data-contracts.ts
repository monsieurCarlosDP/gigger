export interface GenericResponse<T> {
    data: DataObject<T>[];
    meta: Pagination;

}

export interface DataObject<T> {
    id: number;
    attributes: T;
}

export interface ISongListItemViewModelV1Body {
    id: number;
    Title: string;
    Artist: string;
    Duration: number;
}

export interface Pagination {
    page:      number;
    pageSize:  number;
    pageCount: number;
    total:     number;
}