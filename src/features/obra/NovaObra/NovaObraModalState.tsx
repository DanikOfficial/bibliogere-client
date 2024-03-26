import { EMPTY_OPTION } from '../../../components/reusable/data/Constants'
import {
  ObraRequest,
  ObraFormErrorState,
  ObraForm,
} from '../data/ObraInterfaces'

export const initialObraFormState: ObraForm = {
  type: EMPTY_OPTION,
  autor: '',
  ano: '',
  quantidadeInicial: '',
  titulo: '',
  estante: { label: '', value: '' },
  localizacao: { label: '', value: '' },
}

export const initialErrorState: ObraFormErrorState = {
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
