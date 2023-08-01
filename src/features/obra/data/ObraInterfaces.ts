import {
  Monografia,
  Livro,
} from '../../../components/reusable/data/CommonInterfaces'
import type { EstanteResponse } from '../../estantes/data/EstanteInterfaces'
import type Option from '../../../app/interfaces/Option'

export type ObraType = Monografia | Livro | string

export interface ObraEntity {
  codigo: number
  autor: string
  titulo: string
  ano: number
  quantidadeAtual: number
  estante: EstanteResponse
  nomeEstante: string
  localizacaoDesignacao: string
  tipoObra: string
  tutor?: string
  editora?: string
}

export interface ObraResponse extends ObraEntity {}

export interface Obra {
  [key: string]: string | number | undefined
  codigo?: number
  type: ObraType
  autor: string
  titulo: string
  ano: number | string
  quantidadeInicial: number | string
  quantidadeAtual?: number
  tutor?: string
  editora?: string
}

export interface ObraForm {
  [key: string]: string | number | undefined | Option
  type: Option
  autor: string
  titulo: string
  ano: number | string
  quantidadeInicial: number | string
  quantidadeAtual?: number
  tutor?: string
  editora?: string
  localizacao: Option
  estante: Option
}

export interface ObraRequest {
  obra: Obra
  codigoEstante: number
  codigoObra?: number
  codigoLocalizacao: number
}

export type SingleObra = {
  obra: ObraEntity
  meta: unknown
  arg: unknown
}

export interface ObraFormErrorState {
  error: boolean
  message: string
  errors?: {
    titulo: string
    autor: string
    ano: string
    quantidadeInicial: string
    editora?: string
    tutor?: string
  }
}

export interface FormSearchState {
  [key: string]: string | number | undefined
  ano: number | string
  autor: string
  editora?: string
  tutor?: string
}
