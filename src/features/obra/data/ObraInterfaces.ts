import type { Estante } from '../../estantes/EstanteInterfaces'

export type Monografia = 'monografia' | 'Monografia'

export type Livro = 'livro' | 'Livro'

export type ObraType = Monografia | Livro | ''

export interface ObraResponse {
  codigo: number
  autor: string
  titulo: string
  ano: number
  quantidadeAtual: number
  estante: Estante
  nomeEstante: string
  localizacaoDesignacao: string
  tipoObra: string
  tuto?: string
  editora?: string
}

export interface Obra {
  [key: string]: string | number | undefined
  type: ObraType
  autor: string
  titulo: string
  quantidadeInicial: number
  quantidadeAtual?: number
  tutor?: string
  editora?: string
}

export interface ObraRequest {
  obra: Obra
  codigoEstante: number
  codigoObra?: number
  codigoLocalizacao: number
}

export type SingleObra = {
  obra: ObraResponse
  meta: unknown
  arg: unknown
}

export interface FormErrorState {
  error: boolean
  message: string
  errors?: {
    titulo: ''
    autor: ''
    ano: ''
    quantidadeInicial: ''
    editora?: ''
    tutor?: ''
  }
}

export interface FormSearchState {
  [key: string]: string | number | undefined
  ano: number | string
  autor: string
  editora?: string
  tutor?: string
}
