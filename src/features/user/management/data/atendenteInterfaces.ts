import { ApiError } from "../../../../components/reusable/data/CommonInterfaces";

export interface AtendenteInfo {
  nome: string;
  codigo: number;
  username: string;
  isActive: boolean;
}

export interface AtendenteForm {
  nome: string;
  username: string
}

export interface AtendenteRequest extends AtendenteForm { }

export interface AtendenteResponseError extends ApiError<AtendenteRequest> { }

export interface AtendenteResponse extends AtendenteInfo { }

export const defaultAtendenteFormState: AtendenteForm = {
  nome: "",
  username: ""
}

export const defaultAtendenteResponseError: AtendenteResponseError = {
  error: false,
  message: "",
  errors: {
    nome: "",
    username: ""
  }
}
