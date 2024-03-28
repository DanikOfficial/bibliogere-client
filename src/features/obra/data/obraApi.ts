import toast from 'react-hot-toast'
import Logger from '../../../utils/reusable/Logger'
import { api } from '../../api/apiSlice'
import {
  ObraForm,
  ObraRequest,
  ObraResponse,
  UpdateObraRequest,
} from './ObraInterfaces'
import {
  obraAdded,
  obraDeleted,
  obraSelected,
  obraUpdated,
  obrasAdded,
} from './obraSlice'

const logger = Logger.getInstance()

// TODO: After finishing admin features, implement Atendente obra features
const obraApi = api.injectEndpoints({
  endpoints: (build) => ({
    getObras: build.query<ObraResponse[], void>({
      query: () => '/obras',
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled

        if (data) {
          logger.log('Get obras request successfully executed!')
          dispatch(obrasAdded(data))
        }
      },
    }),
    getObra: build.query<ObraResponse, number>({
      query: (codigoObra: number) => `/obras/${codigoObra}`,
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        toast.loading('Carregando obra...')

        try {
          const { data: obra } = await queryFulfilled

          if (obra) {
            toast.dismiss()
            toast.success('Obra carregada com sucesso', { duration: 3000 })
            logger.log('Get obra successfully executed')

            const selectedObra: ObraForm = {
              codigo: obra.codigo,
              ano: obra.ano,
              autor: obra.autor,
              estante: { label: obra.estante.nome, value: obra.estante.codigo },
              localizacao: {
                label: obra.localizacao.designacao,
                value: obra.localizacao.codigo,
              },
              type: { label: obra.type, value: obra.type },
              titulo: obra.titulo,
              quantidadeInicial: obra.quantidadeAtual,
              ...(obra.tutor && { tutor: obra.tutor }),
              ...(obra.editora && { editora: obra.editora }),
            }
            dispatch(obraSelected(selectedObra))

            // In order to keep the data synced with the backend information, we update this too
            dispatch(obraUpdated(obra))
          }
        } catch (err: any) {
          const { error } = err
          toast.dismiss()
          if (error.status === 404) {
            const { message } = error.data
            toast.error(message, { duration: 5000 })
          }
        }
      },
    }),
    createObra: build.mutation<ObraResponse, ObraRequest>({
      query: ({ codigoLocalizacao, codigoEstante, obra }) => ({
        url: `/admin/obras/estante/${codigoEstante}/localizacao/${codigoLocalizacao}`,
        method: 'POST',
        body: obra,
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled

        if (data) {
          logger.log('Create obra request successfully executed!')
          dispatch(obraAdded(data))
        }
      },
    }),
    updateObra: build.mutation<ObraResponse, UpdateObraRequest>({
      query: ({ codigoObra, codigoEstante, codigoLocalizacao, data }) => ({
        url: `/admin/obra/${codigoObra}/estante/${codigoEstante}/localizacao/${codigoLocalizacao}`,
        method: 'PATCH',
        body: data,
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled

        if (data) {
          logger.log('Update obra request successfully executed!')
          dispatch(obraUpdated(data))
        }
      },
    }),
    deleteObra: build.mutation<number, number>({
      query: (codigoObra: number) => ({
        url: `/admin/obra/${codigoObra}`,
        method: 'DELETE',
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled

        if (data) {
          logger.log(`Delete obra request successfully executed!`)
          dispatch(obraDeleted(data))
        }
      },
    }),
  }),
})

export const {
  useCreateObraMutation,
  useUpdateObraMutation,
  useDeleteObraMutation,
  useGetObrasQuery,
  useGetObraQuery,
} = obraApi

export default obraApi
