import { TipoEstante } from './interfaces'
import Logger from '../../utils/reusable/Logger'
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'

const logger = Logger.getInstance()

const comparer = (
  firstTipoEstante: TipoEstante,
  secondTipoEstante: TipoEstante
) => {
  if (firstTipoEstante.codigo < secondTipoEstante.codigo) return -1
  if (firstTipoEstante.codigo > secondTipoEstante.codigo) return 1
  return 0
}

const tipoEstanteAdapter = createEntityAdapter<TipoEstante>({
  selectId: (tipoEstante) => tipoEstante.codigo,
  sortComparer: (firstTipoEstante, secondTipoEstante) =>
    comparer(firstTipoEstante, secondTipoEstante),
})

// For simplicity sake, this will be hardcoded now
const initialState = tipoEstanteAdapter.getInitialState({
  ids: [6, 7],
  entities: {
    6: { codigo: 6, designacao: 'Monografia' },
    7: { codigo: 7, designacao: 'Livro' },
  },
})

const tipoEstanteSlice = createSlice({
  name: 'tipoEstante',
  initialState,
  reducers: {},
})

export const { selectAll: selectAllTipoEstantes } =
  tipoEstanteAdapter.getSelectors((state: RootState) => state.tipoEstante)

export default tipoEstanteSlice.reducer
