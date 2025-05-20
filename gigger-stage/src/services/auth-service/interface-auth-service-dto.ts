import { ILoginResponseViewModelV1, ILoginData, IUserDataViewModelV1 } from "@/src/data/data-contracts";

export interface ILoginResponseDTO extends ILoginResponseViewModelV1 {}

export interface IUserData extends IUserDataViewModelV1 {}

export interface ILoginErrorResponseDTO {
    data: null,
    error: {
        details: {},
        message: string,
        name: string,
        status: 400
    }
}