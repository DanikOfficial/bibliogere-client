import type Option from '../../../app/interfaces/Option'
import {
  Monografia,
  Livro,
  ApiError,
} from '../../../components/reusable/data/CommonInterfaces'

export type EstanteType = Monografia | Livro | ''

export interface EstanteResponse extends EstanteEntity {}

export interface EstanteEntity {
  codigo: number
  nome: string
  tipoEstante: string
}

// This interface was created in mind with the context of using React Select Library
export interface EstanteForm {
  codigo: number
  nome: string
  tipoEstante: Option
}

export interface EstanteRequest {
  nome: string
  tipoEstante: string
}

export interface UpdateEstanteRequest {
  codigoEstante: number
  data: {
    nome?: string
    tipoEstante?: string
  }
}

export interface EstanteFormErrorResponse extends ApiError<EstanteRequest> {}

export const defaultEstanteFormState: EstanteForm = {
  codigo: -1,
  nome: '',
  tipoEstante: { value: '', label: '' },
}

export const defaultEstanteErrorFormState: EstanteFormErrorResponse = {
  error: false,
  message: '',
  errors: {
    nome: '',
    tipoEstante: '',
  },
}
