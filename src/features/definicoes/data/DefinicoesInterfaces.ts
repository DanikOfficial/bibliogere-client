import { ApiError } from "@/components/reusable/data/CommonInterfaces";

export interface BasePasswordRequest {
  newPassword: string;
  confirmPassword: string;
}

export interface UpdatePasswordRequest extends BasePasswordRequest {
  oldPassword: string,
  codigoUtilizador: number
}

export interface UpdatePasswordErrorResponse {
  error: boolean
  message: string
  errors?: {
    oldPassword?: string,
    newPassword: string,
    confirmPassword: string
  }
}

export const defaultUpdatePasswordRequest: UpdatePasswordRequest = {
  codigoUtilizador: 0,
  oldPassword: "",
  newPassword: "",
  confirmPassword: ""
}

export interface CreatePasswordRequest extends BasePasswordRequest {
  username: string,
}

export interface CreatePasswordErrorResponse extends ApiError<CreatePasswordRequest> { }

export const defaultCreatePasswordErrorResponse: CreatePasswordErrorResponse = {
  error: false,
  message: "",
  errors: {
    confirmPassword: "",
    newPassword: "",
    username: ""
  }
}

export const defaultCreatePasswordRequest: CreatePasswordRequest = {
  newPassword: "",
  confirmPassword: "",
  username: ""
}

export interface CreatePasswordState {
  username: string
}


export const defaultUpdatePasswordErrorResponse: UpdatePasswordErrorResponse = {
  error: false,
  message: "",
  errors: {
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  }
}

