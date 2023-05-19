import {
  createEntityAdapter,
  EntityAdapter,
} from '@reduxjs/toolkit'
import { api } from '../api/apiSlice'
import type { Estante } from './EstanteInterfaces'
import { estanteAdded, estanteUpdated, estanteDeleted, estantesAdded } from './estanteSlice'
import { EstanteRequest, EstanteResponse, UpdateEstanteRequest } from './data/EstanteInterfaces'
import Logger from '../../utils/reusable/Logger'

const logger = Logger.getInstance()

const estantesAdapter: EntityAdapter<Estante> = createEntityAdapter<Estante>({
  selectId: (response) => response.codigo,
})

const initialState = estantesAdapter.getInitialState()

const estanteApi = api.injectEndpoints({
  endpoints: (build) => ({
    getEstantes: build.query<Estante[], void>({
      query: () => "/estantes",
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled

        if (data) {
          logger.log('Get Estante request successfully sent!')
          dispatch(estantesAdded(data))
        }
      }
    }),
    createEstante: build.mutation<EstanteResponse, EstanteRequest>({
      query: (estante: EstanteRequest) => ({
        url: '/admin/estantes',
        method: 'POST',
        body: estante,
      }),
      onQueryStarted: async (estante, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled

        if (data) {
          logger.log("Create Estante request successfully sent!")
          dispatch(estanteAdded(data))
        }

        logger.warn("Create Estante Request could not be sent!")
      }
    }),
    updateEstante: build.mutation<EstanteResponse, UpdateEstanteRequest>({
      query: (updateEstanteRequest: UpdateEstanteRequest) => ({
        url: `/estante/${updateEstanteRequest.codigoEstante}`,
        method: 'POST',
        body: updateEstanteRequest.data
      }),
      onQueryStarted: async (estante, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled

        if (data) {
          logger.log("Update estante request successfully sent!")
          dispatch(estanteUpdated(data))
        }

        logger.warn("Update Estante Request could not be sent!")

      }
    }),
    deleteEstante: build.mutation<number, number>({
      query: (codigoEstante: number) => ({
        url: `/admin/estante/${codigoEstante}`,
        method: "DELETE",
      }),
      onQueryStarted: async (codigoEstante, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled

        if (data) {
          logger.log(`Delete estante request successfully sent!`)
          dispatch(estanteDeleted(data))
        }

        logger.warn("Delete Estante Request could not be sent!")
      },
    })
  }),
})

export const { useCreateEstanteMutation, useUpdateEstanteMutation, useDeleteEstanteMutation, useGetEstantesQuery } = estanteApi

export default estanteApi