import { api } from '../../api/apiSlice'

import {
  estanteAdded,
  estanteUpdated,
  estanteDeleted,
  estantesAdded,
} from './estanteSlice'
import {
  EstanteRequest,
  EstanteResponse,
  UpdateEstanteRequest,
} from './EstanteInterfaces'
import Logger from '../../../utils/reusable/Logger'

const logger = Logger.getInstance()

const estanteApi = api.injectEndpoints({
  endpoints: (build) => ({
    getEstantes: build.query<EstanteResponse[], void>({
      query: () => '/estantes',
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled

        if (data) {
          logger.log('Get Estante request successfully sent!')
          dispatch(estantesAdded(data))
        }
      },
    }),
    createEstante: build.mutation<EstanteResponse, EstanteRequest>({
      query: (estante: EstanteRequest) => ({
        url: '/admin/estantes',
        method: 'POST',
        body: estante,
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled

        if (data) {
          logger.log('Create Estante request successfully sent!')
          dispatch(estanteAdded(data))
        } else {
          logger.warn('Create Estante Request could not be sent!')
        }
      },
    }),
    updateEstante: build.mutation<EstanteResponse, UpdateEstanteRequest>({
      query: ({ codigoEstante, data }: UpdateEstanteRequest) => ({
        url: `/admin/estante/${codigoEstante}`,
        method: 'PATCH',
        body: data,
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled

        if (data) {
          logger.log('Update estante request successfully sent!')
          dispatch(estanteUpdated(data))
        } else {
          logger.warn('Update Estante Request could not be sent!')
        }
      },
    }),
    deleteEstante: build.mutation<number, number>({
      query: (codigoEstante: number) => ({
        url: `/admin/estante/${codigoEstante}`,
        method: 'DELETE',
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled

        if (data) {
          logger.log(`Delete estante request successfully sent!`)
          dispatch(estanteDeleted(data))
        } else {
          logger.warn('Delete Estante Request could not be sent!')
        }
      },
    }),
  }),
})

export const {
  useCreateEstanteMutation,
  useUpdateEstanteMutation,
  useDeleteEstanteMutation,
  useGetEstantesQuery,
} = estanteApi

export default estanteApi
