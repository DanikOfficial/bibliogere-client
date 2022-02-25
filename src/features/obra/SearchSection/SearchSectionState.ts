import { Option } from '../../../app/interfaces/Option'
import { FormSearchState } from '../data/ObraInterfaces'

export const InitialAdvancedSearchState: FormSearchState = {
  ano: '',
  autor: '',
}

export const tipoObraOptionsInitialState: Option[] = [
  { value: '', label: 'Tipo de obra por pesquisar' },
  { value: 'monografia', label: 'Monografia' },
  { value: 'livro', label: 'Livro' },
]
