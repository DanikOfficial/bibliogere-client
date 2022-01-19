import axios from 'axios'
import {
  createEntityAdapter,
  createSelector,
  EntityAdapter,
  EntityState,
} from '@reduxjs/toolkit'
import { api } from '../api/apiSlice'
import { RootState } from '../../app/store'
import type { Estante } from './EstanteInterfaces'

const estantesAdapter: EntityAdapter<Estante> = createEntityAdapter<Estante>({
  selectId: (response) => response.codigo,
})

const initialState = estantesAdapter.getInitialState()

const estanteApi = api.injectEndpoints({
  endpoints: (build) => ({
    getEstantes: build.query<EntityState<Estante>, void>({
      queryFn: async () => {
        const request = await axios.get('/api/v1/estantes')
        const data = request.data as Estante[]

        return { data: estantesAdapter.setAll(initialState, data) }
      },
    }),
  }),
})

const selectEstantesResult = estanteApi.endpoints.getEstantes.select()

const selectEstantesData = createSelector(
  selectEstantesResult,
  (estantesResult) => estantesResult.data
)

export const { selectAll: selectAllEstantes } = estantesAdapter.getSelectors(
  (state: RootState) => selectEstantesData(state) ?? initialState
)

export const selectEstantesByTipoObra = createSelector(
  [selectAllEstantes, (state: RootState, tipoEstante: string) => tipoEstante],
  (estantes, tipoEstante) =>
    estantes.filter((estante) => estante.tipoEstante === tipoEstante)
)

export default estanteApi
