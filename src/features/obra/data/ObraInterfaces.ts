import {
  Monografia,
  Livro,
} from '../../../components/reusable/data/CommonInterfaces'
import type { EstanteEntity } from '../../estantes/data/EstanteInterfaces'
import type Option from '../../../app/interfaces/Option'
import { EMPTY_OPTION } from '../../../components/reusable/data/Constants'
import { LocalizacaoEntity } from '../../localizacoes/localizacaoApi'

export type ObraType = Monografia | Livro | string

export interface ObraEntity {
  [key: string]: any
  type: string
  codigo: number
  autor: string
  titulo: string
  ano: number
  quantidadeAtual: number
  estante: EstanteEntity
  nomeEstante: string
  localizacao: LocalizacaoEntity
  localizacaoDesignacao: string
  tipoObra: string
  tutor?: string
  editora?: string
}

export interface ObraResponse extends ObraEntity {}

export interface Obra {
  [key: string]: string | number | undefined
  codigo?: number
  codigoEstante?: number
  codigoLocalizacao?: number
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
  codigo?: number
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
}

export interface UpdateObraRequest {
  codigoObra: number
  codigoEstante: number
  codigoLocalizacao: number
  data: {
    type?: string
    autor?: string
    titulo?: string
    ano?: number | string
    quantidadeInicial?: number | string
    quantidadeAtual?: number
    tutor?: string
    editora?: string
  }
}

export type SingleObra = {
  obra: ObraEntity
  meta: unknown
  arg: unknown
}

export interface ObraFormErrorResponse {
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

export const defaultObraFormState: ObraForm = {
  type: EMPTY_OPTION,
  autor: '',
  ano: '',
  quantidadeInicial: '',
  titulo: '',
  estante: EMPTY_OPTION,
  localizacao: EMPTY_OPTION,
}

export const defaultObraFormErrorResponse: ObraFormErrorResponse = {
  error: false,
  message: '',
  errors: {
    titulo: '',
    autor: '',
    ano: '',
    quantidadeInicial: '',
    editora: '',
    tutor: '',
  },
}

export const initialTipoObraOptionsState = [
  { value: 'livro', label: 'Livro' },
  { value: 'monografia', label: 'Monografia' },
]
