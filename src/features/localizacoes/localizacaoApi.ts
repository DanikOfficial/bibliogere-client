import {
  createEntityAdapter,
  createSelector,
  EntityState,
} from '@reduxjs/toolkit'

import axios from 'axios'

import { RootState } from '../../app/store'

import { api } from '../api/baseApi'

export interface Localizacao {
  codigo: number
  designacao: string
}

export interface LocalizacaoEntity extends Localizacao { }

const localizacoesAdapter = createEntityAdapter<Localizacao>({
  selectId: (response) => {
    return response.codigo
  },
})

const initialState = localizacoesAdapter.getInitialState()

export const localizacaoApi = api.injectEndpoints({
  endpoints: (build) => ({
    getLocalizacoes: build.query<EntityState<Localizacao>, void>({
      async queryFn(args, api, extraOptions, baseQuery) {
        const request = await axios.get('/api/v1/localizacoes')
        const data = request.data as Localizacao[]

        return { data: localizacoesAdapter.setAll(initialState, data) }
      },
    }),
  }),
})

const selectLocalizacoesResult =
  localizacaoApi.endpoints.getLocalizacoes.select()

const selectLocalizacoesData = createSelector(
  selectLocalizacoesResult,
  (localizacoesResult) => {
    return localizacoesResult.data
  }
)

export const { selectAll: selectAllLocalizacoes } =
  localizacoesAdapter.getSelectors(
    (state: RootState) => selectLocalizacoesData(state) ?? initialState
  )

export default localizacaoApi
