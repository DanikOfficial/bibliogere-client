import type { Estante } from '../../estantes/data/EstanteInterfaces'

export type Monografia = 'monografia' | 'Monografia'

export type Livro = 'livro' | 'Livro'

export type ObraType = Monografia | Livro | ''

export interface ObraEntity {
  codigo: number
  autor: string
  titulo: string
  ano: number
  quantidadeAtual: number
  estante: Estante
  nomeEstante: string
  localizacaoDesignacao: string
  tipoObra: string
  tutor?: string
  editora?: string
}

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

export interface FormErrorState {
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
