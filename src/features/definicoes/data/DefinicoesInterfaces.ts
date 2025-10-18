export interface CreatePasswordRequest {
    codigoUtilizador: number;
    newPassword: string;
    confirmPassword: string;
}

export interface UpdatePasswordRequest extends CreatePasswordRequest {
   oldPassword: string
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

export const defaultCreatePasswordRequest: CreatePasswordRequest = {
  codigoUtilizador: 0,
  newPassword: "",
  confirmPassword: ""
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

