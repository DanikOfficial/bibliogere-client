import { ApiError } from '@/components/reusable/data/CommonInterfaces'
import { ObraEntity } from '../../obra/data/ObraInterfaces'
import Option from '@/app/interfaces/Option'

export interface EmprestimoEntity {
  [key: string]: any
  codigo: number
  utente: string
  contacto: string
  email: string,
  multa: number
  itens?: ItemEmprestimoEntity[]
}

export interface EmprestimoEntityResponse extends EmprestimoEntity {
  itens: ItemEmprestimoEntity[]
}

export interface EmprestimoForm {
  codigo?: number
  utente: string
  contacto: string
  email: string
}

export interface CreateEmprestimoRequest extends EmprestimoForm {
  obrasIds: number[]
}

export interface GenerateEmprestimosReportForm {
  dataInicio: string,
  dataFim: string,
  situacaoEmprestimo?: Option
}

export interface GenerateEmprestimoRequest {
  dataInicio: string,
  dataFim: string,
  situacaoEmprestimo: string
}

export interface GenerateEmprestimoRequestErrorResponse extends ApiError<GenerateEmprestimoRequest> { }

export const defaulGenerateEmprestimoRequestErrorResponse: GenerateEmprestimoRequestErrorResponse = {
  error: false,
  message: '',
  errors: {
    dataInicio: '',
    dataFim: '',
    situacaoEmprestimo: ""
  }
}

export const defaultGenerateEmprestimoFormState: GenerateEmprestimosReportForm = {
  dataInicio: '',
  dataFim: '',
  situacaoEmprestimo: { value: '', label: '' }
}


export interface CreateEmprestimoResponse extends EmprestimoEntity {
  itens: ItemEmprestimoEntity[]
}

export interface EmprestimoFormErrorResponse {
  error: boolean
  message: string
  errors?: {
    contacto?: string,
    utente: string,
    email: string
  }
}

export interface ItemEmprestimoEntity {
  codigo: number
  utente: string
  data_devolucao: string
  data_realizacao: string
  situacao: string
  obra: ObraEntity
}

export interface EmprestimoResponse extends EmprestimoEntity { }

export interface EmprestimoComponentProps {
  emprestimo: EmprestimoEntity
  onClickVisualizar: (codigoEmprestimo: number) => void
}

export type SituacaoEmprestimo = 'Activo' | 'Expirado' | 'Devolvido'

export const defaultEmprestimoFormState: EmprestimoForm = {
  contacto: '',
  email: '',
  codigo: -1,
  utente: '',
}

export const defaultEmprestimoErrorResponse: EmprestimoFormErrorResponse = {
  error: false,
  message: '',
  errors: {
    contacto: '',
    utente: '',
    email: ''
  }
}
