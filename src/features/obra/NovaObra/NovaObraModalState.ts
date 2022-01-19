import { ObraRequest, FormErrorState, Obra } from '../data/ObraInterfaces'

export const initialObraState: Obra = {
  type: 'livro',
  autor: '',
  quantidadeInicial: -1,
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
