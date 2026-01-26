import {
  createEntityAdapter,
  createSelector,
  EntityState,
} from '@reduxjs/toolkit'

import { RootState } from '../../app/store'

import { api } from '../api/baseApi'

export interface Localizacao {
  codigo: number
  designacao: string
}

export interface LocalizacaoEntity extends Localizacao { }

const localizacoesAdapter = createEntityAdapter<Localizacao, number>({
  selectId: (response) => {
    return response.codigo
  },
})

const initialState = localizacoesAdapter.getInitialState()

export const localizacaoApi = api.injectEndpoints({
  endpoints: (build) => ({
    getLocalizacoes: build.query<EntityState<Localizacao, number>, void>({
      query: () => '/api/v1/localizacoes',
      transformResponse: (response: Localizacao[]) => {
        return localizacoesAdapter.setAll(initialState, response)
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

export const { useGetLocalizacoesQuery } = localizacaoApi

export default localizacaoApi
