import { ObraEntity } from '../../obra/data/ObraInterfaces'

export interface EmprestimoEntity {
  [key: string]: any
  codigo: number
  utente: string
  contacto: string
  email: string
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
  utente_contacto: string
  utente_email: string
  data_devolucao: string
  data_realizacao: string
  situacao: string
  obra: ObraEntity
}

export interface EmprestimoResponse extends EmprestimoEntity {}

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
