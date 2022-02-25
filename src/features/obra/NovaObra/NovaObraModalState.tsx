import { ObraRequest, FormErrorState, Obra } from '../data/ObraInterfaces'

export const initialObraState: Obra = {
  type: '',
  autor: '',
  ano: '',
  quantidadeInicial: '',
  titulo: '',
}

export const initialObraRequestState: ObraRequest = {
  codigoEstante: -1,
  codigoLocalizacao: -1,
  obra: initialObraState,
}

export const initialErrorState: FormErrorState = {
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
  {
    value: '',
    label: 'Tipo de obra por registar!',
  },
  { value: 'livro', label: 'Livro' },
  { value: 'monografia', label: 'Monografia' },
]
