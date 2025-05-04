//#region Base structure
export interface GenericResponse<T> {
    data: DataObject<T>[] | DataObject<T>;
    meta: Pagination;

}

export interface SimpleCollection<T> {
    data: T;
    updatedAt?: string;
}
export interface DataObject<T> {
    id: number;
    attributes: T;
}
export interface Pagination {
    page:      number;
    pageSize:  number;
    pageCount: number;
    total:     number;
}

//#region

//#region Songs
export interface ISongListItemViewModelV1Body {
    id: number;
    Title: string;
    Artist: string;
    Duration: number;
    tags?: SimpleCollection<DataObject<ITagsItemViewModelV1Body>[]>
}

//#region

//#region Setlists

export interface ISetlistListItemViewModelV1Body {
    id:          number;
    Name:        string;
    Date:        null;
    Descripcion: Descripcion[];
    createdAt:   Date;
    updatedAt:   Date;
    publishedAt: Date;
    songs:       SimpleCollection<DataObject<ISongListItemViewModelV1Body>[]>;
}

//#endregion

//#region Tags

export interface ITagsItemViewModelV1Body {
    name: string,
    Color: string,
    Icon: string
}
//#endregion 

export type Descripcion = {
    type:     string;
    children: Child[];
}

export type Child = {
    type: string;
    text: string;
}
//#region

//#region Dashboard
export interface IDashboardItemViewModelV1Body {
    songs: number,
    setlists: number,
    events: number,
    eventList: IEventViewModelV1Body[]
}
//#endregion

export interface IEventViewModelV1Body {
    id?:          number;
    Date?:        Date;
    createdAt?:   Date;
    updatedAt?:   Date;
    publishedAt?: Date;
    Location?:    IEventLocation;
    Url?:         null;
    Private?:     boolean;
    Title?:       string;
    Type?:        EventType;
    Time?:        null;
}

export interface IEventLocation {
    address?:     string;
    coordinates?: Coordinates;
    geohash?:     string;
}


export interface Coordinates {
    lat: number;
    lng: number;
}
export enum EventType {
    Boda = "Boda",
}
